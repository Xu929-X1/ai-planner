'use client';

import { memo, useCallback } from 'react';
import { Button } from '@/components/UI/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/UI/dropdown-menu';
import { useNodeId, useReactFlow } from '@xyflow/react';
import { EllipsisVertical, Rocket, Trash } from 'lucide-react';
import { BaseNode, BaseNodeContent, BaseNodeHeader, BaseNodeHeaderTitle } from '@/components/base-node';

const NodeWithActions = memo(() => {
  const id = useNodeId();
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = useCallback(() => {
    if (!id) return;
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges?.((prev) => prev.filter((e) => e.source !== id && e.target !== id));
  }, [id, setNodes, setEdges]);

  const stopPtr = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <BaseNode>
      <BaseNodeHeader className="border-b">
        <Rocket className="size-4" />
        <BaseNodeHeaderTitle>Node With Actions</BaseNodeHeaderTitle>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="nodrag p-1" onPointerDown={stopPtr}>
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleDelete}>Delete Node</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          className="nodrag p-1"
          onClick={handleDelete}
          onPointerDown={stopPtr}
          aria-label="Delete Node"
          title="Delete Node"
        >
          <Trash className="size-4" />
        </Button>
      </BaseNodeHeader>
      <BaseNodeContent>
        <p>Add your content here.</p>
      </BaseNodeContent>
    </BaseNode>
  );
});

NodeWithActions.displayName = 'NodeWithActions';

export { NodeWithActions };
