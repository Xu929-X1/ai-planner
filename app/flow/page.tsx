'use client';

import { useMemo } from 'react';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NodeWithActions } from '@/components/nodes/NodeWithActions';


export default function FlowPage() {
    const nodes = useMemo(
        () => [
            { id: 'n1', type: 'actions', position: { x: 100, y: 80 }, data: {} },
        ],
        []
    );
    const edges = useMemo(() => [], []);

    const nodeTypes = useMemo(
        () => ({ actions: NodeWithActions }),
        []
    );

    return (
        <ReactFlowProvider>
            <div className="h-[calc(100vh-64px)]">
                <ReactFlow
                    defaultNodes={nodes}
                    defaultEdges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                />
            </div>
        </ReactFlowProvider>
    );
}