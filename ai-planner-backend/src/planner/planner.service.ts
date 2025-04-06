import { Injectable } from '@nestjs/common';
import { CreatePlannerDto } from './dto/create-planner.dto';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class PlannerService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async create(createPlannerDto: CreatePlannerDto) {
    const userInput = createPlannerDto.input;
    const functions = [
      {
        name: 'create_calendar_event',
        description: '从自然语言中创建日历事件',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', description: '事件标题' },
            start_time: {
              type: 'string',
              format: 'date-time',
              description: 'ISO 格式开始时间',
            },
            end_time: {
              type: 'string',
              format: 'date-time',
              description: 'ISO 格式结束时间',
            },
          },
          required: ['title', 'start_time', 'end_time'],
        },
      },
    ];
    const check = await this.openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [
        {
          role: 'system',
          content: `你是一个分类助手。用户会输入一句话，请判断它是否是一个“需要安排进日历的任务”。
                    请仅回答 "yes" 或 "no"。
                    示例：
                      - "明天下午开会 2 小时" → yes
                      - "我要打游戏" → yes
                      - "我不吃牛肉" → no
                      - "你是谁" → no
                      - "我明天想想再说" → no
                      - "后天复习数学" → yes`,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      temperature: 0,
    });

    const decision = check.choices[0].message.content?.trim().toLowerCase();

    if (decision !== 'yes') {
      return { message: '抱歉，这不是一个可以安排的日程内容。请重新输入。' };
    }
    const completion = await this.openai.chat.completions.create({
      //TODO: 环境变量设置模型，而且要考虑用户可能胡乱输入和任务不匹配的情况
      model: 'gpt-4-0125-preview',
      temperature: 0.2,
      top_p: 1,
      messages: [
        {
          role: 'system',
          content: `你是一个日程解析助手，用户会输入一段自然语言计划。你需要把它转化为结构化的日程任务。输出内容必须严格符合函数格式，不要输出多余说明。`,
        },
        {
          role: 'user',
          content: '明天下午三点健身两个小时',
        },
        {
          role: 'function',
          name: 'create_calendar_event',
          content: JSON.stringify({
            title: '健身',
            start_time: '2025-04-06T15:00:00+08:00',
            end_time: '2025-04-06T17:00:00+08:00',
          }),
        },
        {
          role: 'user',
          content: '周五上午 10 点开会 1.5 小时',
        },
        {
          role: 'function',
          name: 'create_calendar_event',
          content: JSON.stringify({
            title: '开会',
            start_time: '2025-04-04T10:00:00+08:00',
            end_time: '2025-04-04T11:30:00+08:00',
          }),
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      functions,
      function_call: { name: 'create_calendar_event' },
    });

    const response = completion.choices[0].message.function_call;

    if (!response || !response.arguments) {
      throw new Error('AI 无法解析输入');
    }

    const parsed = JSON.parse(response.arguments);
    return parsed; // title, start_time, end_time
  }
}