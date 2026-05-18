import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import {
  ArrowLeft,
  FilePlus,
  Globe,
  AlertTriangle,
  Archive,
  ShieldOff,
  ArrowRight,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { getAPIById } from '@/lib/data';

// ===== Types =====
type LifecycleState = 'CREATED' | 'PUBLISHED' | 'DEPRECATED' | 'RETIRED' | 'BLOCKED';

interface Transition {
  id: string;
  timestamp: string;
  user: { name: string; email: string; avatar: string | null };
  from: LifecycleState | null;
  to: LifecycleState;
  reason: string;
}

interface LifecycleNode {
  state: LifecycleState;
  label: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}

// ===== Constants =====

const nodes: LifecycleNode[] = [
  {
    state: 'CREATED',
    label: 'CREATED',
    color: '#3B82F6',
    icon: <FilePlus className="w-4 h-4" />,
    description: 'This API is created but not yet published. Only you can see it.',
  },
  {
    state: 'PUBLISHED',
    label: 'PUBLISHED',
    color: '#10B981',
    icon: <Globe className="w-4 h-4" />,
    description: 'This API is live and available to developers in the portal.',
  },
  {
    state: 'DEPRECATED',
    label: 'DEPRECATED',
    color: '#F59E0B',
    icon: <AlertTriangle className="w-4 h-4" />,
    description: 'This API is marked for retirement. Existing subscriptions remain active.',
  },
  {
    state: 'RETIRED',
    label: 'RETIRED',
    color: '#6B7280',
    icon: <Archive className="w-4 h-4" />,
    description: 'This API is retired. No new subscriptions. Existing ones remain.',
  },
  {
    state: 'BLOCKED',
    label: 'BLOCKED',
    color: '#EF4444',
    icon: <ShieldOff className="w-4 h-4" />,
    description: 'This API is blocked. All access is denied.',
  },
];

// Valid transitions from each state
const validTransitions: Record<LifecycleState, LifecycleState[]> = {
  CREATED: ['PUBLISHED', 'BLOCKED'],
  PUBLISHED: ['DEPRECATED', 'BLOCKED'],
  DEPRECATED: ['RETIRED', 'PUBLISHED'],
  RETIRED: [],
  BLOCKED: ['PUBLISHED', 'CREATED'],
};

const actionLabels: Record<string, { label: string; color: string }> = {
  PUBLISHED: { label: 'Publish API', color: '#10B981' },
  DEPRECATED: { label: 'Deprecate', color: '#F59E0B' },
  RETIRED: { label: 'Retire', color: '#6B7280' },
  BLOCKED: { label: 'Block', color: '#EF4444' },
  CREATED: { label: 'Restore to Created', color: '#3B82F6' },
};

const warningTexts: Record<string, string> = {
  PUBLISHED: 'This API will become available to all developers in the portal.',
  DEPRECATED: 'This will notify all subscribers that this API is being deprecated.',
  BLOCKED: 'This will immediately deny access to all active subscribers.',
  RETIRED: 'This API will no longer be discoverable. Existing subscriptions will remain.',
  CREATED: 'This API will be restored to the Created state.',
};

// ===== Mock transition history =====
const initialTransitions: Transition[] = [
  {
    id: 't1',
    timestamp: '2024-01-15T10:30:00Z',
    user: { name: 'System', email: 'system@vedadb.com', avatar: null },
    from: null,
    to: 'CREATED',
    reason: 'API created via wizard',
  },
  {
    id: 't2',
    timestamp: '2024-01-20T09:00:00Z',
    user: { name: 'Sarah Chen', email: 'sarah@vedadb.com', avatar: '/avatars/sarah.jpg' },
    from: 'CREATED',
    to: 'PUBLISHED',
    reason: 'Initial release — ready for developer consumption',
  },
  {
    id: 't3',
    timestamp: '2024-06-01T00:00:00Z',
    user: { name: 'Sarah Chen', email: 'sarah@vedadb.com', avatar: '/avatars/sarah.jpg' },
    from: 'PUBLISHED',
    to: 'DEPRECATED',
    reason: 'Migrating to v3.0.0 with breaking changes. Sunsetting v2.x by Dec 2024.',
  },
  {
    id: 't4',
    timestamp: '2024-07-01T00:00:00Z',
    user: { name: 'Sarah Chen', email: 'sarah@vedadb.com', avatar: '/avatars/sarah.jpg' },
    from: 'DEPRECATED',
    to: 'PUBLISHED',
    reason: 'Extended support period. v3 migration delayed to Q1 2025.',
  },
];

// ===== Workflow Graph Arrow Component =====
function GraphArrow({ fromState, toState, currentState }: {
  fromState: LifecycleState;
  toState: LifecycleState;
  currentState: LifecycleState;
}) {
  const isActive = fromState === currentState && validTransitions[currentState]?.includes(toState);
  const isCompleted = nodes.findIndex((n) => n.state === fromState) < nodes.findIndex((n) => n.state === currentState);

  return (
    <div className="flex items-center mx-1">
      <svg width="40" height="20" viewBox="0 0 40 20">
        <line
          x1="0"
          y1="10"
          x2="34"
          y2="10"
          stroke={isActive ? nodes.find((n) => n.state === currentState)?.color : isCompleted ? '#10B981' : '#3D434F'}
          strokeWidth={isActive ? 2 : isCompleted ? 2 : 1}
          strokeDasharray={isActive ? '6,4' : isCompleted ? '0' : '4,4'}
          style={isActive ? { animation: 'dash 1s linear infinite' } : undefined}
        />
        <polygon
          points="34,6 40,10 34,14"
          fill={isActive ? nodes.find((n) => n.state === currentState)?.color : isCompleted ? '#10B981' : '#3D434F'}
        />
      </svg>
    </div>
  );
}

// ===== Main Component =====
export default function LifecyclePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = getAPIById(id || '1');

  const [currentState, setCurrentState] = useState<LifecycleState>((api?.status as LifecycleState) || 'PUBLISHED');
  const [transitions, setTransitions] = useState<Transition[]>(initialTransitions);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    targetState: LifecycleState | null;
    reason: string;
  }>({ open: false, targetState: null, reason: '' });
  const [animatingNode, setAnimatingNode] = useState<string | null>(null);

  const currentNode = nodes.find((n) => n.state === currentState)!;
  const availableTargets = validTransitions[currentState] || [];

  const openConfirm = (target: LifecycleState) => {
    setConfirmDialog({ open: true, targetState: target, reason: '' });
  };

  const executeTransition = useCallback(() => {
    const target = confirmDialog.targetState;
    if (!target) return;

    setConfirmDialog({ open: false, targetState: null, reason: '' });

    // Animate transition
    setAnimatingNode(target);
    setTimeout(() => setAnimatingNode(null), 600);

    // Add transition record
    const newTransition: Transition = {
      id: `t${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: { name: 'Admin User', email: 'admin@vedadb.io', avatar: null },
      from: currentState,
      to: target,
      reason: confirmDialog.reason || 'State transition',
    };

    setTransitions((prev) => [newTransition, ...prev]);
    setCurrentState(target);
  }, [confirmDialog, currentState]);

  // Check if a node is "visited" (has been reached in history)
  const visitedStates = new Set<LifecycleState>();
  transitions.forEach((t) => {
    if (t.to) visitedStates.add(t.to);
    if (t.from) visitedStates.add(t.from);
  });

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/publisher/apis/${id}`)}
          className="flex items-center gap-1.5 text-[13px] text-[#9DA5B4] hover:text-[#E8ECF1] transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {api?.name || 'API'}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#E8ECF1] tracking-tight">Lifecycle Management</h1>
            <p className="text-[13px] text-[#9DA5B4] mt-0.5">Manage the lifecycle state of your API</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={currentState} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/publisher/apis/${id}`)}
              className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              View API
            </Button>
          </div>
        </div>
      </div>

      {/* Workflow Graph */}
      <div className="bg-[#2B2F38] rounded-xl border border-[#3D434F] p-8 mb-6">
        <div className="flex items-center justify-center">
          {nodes.map((node, idx) => {
            const isCurrent = node.state === currentState;
            const isAvailable = availableTargets.includes(node.state);
            const isVisited = visitedStates.has(node.state);
            const isUnavailable = !isCurrent && !isAvailable && !isVisited;

            return (
              <div key={node.state} className="flex items-center">
                {/* Node */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => isAvailable && openConfirm(node.state)}
                    disabled={!isCurrent && !isAvailable}
                    className={cn(
                      'relative flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-bold text-[12px] uppercase tracking-[0.06em] transition-all duration-200',
                      isCurrent && 'scale-110 cursor-default',
                      isAvailable && !isCurrent && 'cursor-pointer hover:scale-105',
                      isUnavailable && 'opacity-40 cursor-default',
                      animatingNode === node.state && 'animate-[bounceIn_500ms_ease-out]'
                    )}
                    style={{
                      borderColor: isCurrent
                        ? node.color
                        : isAvailable
                          ? `${node.color}60`
                          : isVisited
                            ? node.color
                            : '#3D434F',
                      backgroundColor: isCurrent
                        ? `${node.color}25`
                        : isAvailable
                          ? `${node.color}15`
                          : isVisited
                            ? `${node.color}15`
                            : '#181A20',
                      color: node.color,
                      borderStyle: isAvailable && !isCurrent ? 'dashed' : 'solid',
                      boxShadow: isCurrent
                        ? `0 0 0 4px ${node.color}30, 0 0 20px ${node.color}20`
                        : undefined,
                      animation: isCurrent ? 'pulseRing 2s ease-in-out infinite' : undefined,
                    }}
                  >
                    {node.icon}
                    {node.label}
                  </button>
                  {isCurrent && (
                    <span
                      className="text-[11px] font-medium mt-2"
                      style={{ color: node.color }}
                    >
                      Current State
                    </span>
                  )}
                </div>

                {/* Arrow */}
                {idx < nodes.length - 1 && (
                  <GraphArrow
                    fromState={node.state}
                    toState={nodes[idx + 1].state}
                    currentState={currentState}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions Panel */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Current State Info */}
        <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
          <h3 className="text-[16px] font-bold mb-1" style={{ color: currentNode.color }}>
            {currentNode.label}
          </h3>
          <p className="text-[13px] text-[#9DA5B4] mb-3">{currentNode.description}</p>
          <p className="text-[12px] text-[#6B7280]">
            In this state since: {new Date(transitions.find((t) => t.to === currentState)?.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Available Actions */}
        <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
          <h3 className="text-[14px] font-semibold text-[#E8ECF1] mb-3">Available Actions</h3>
          {availableTargets.length === 0 ? (
            <p className="text-[13px] text-[#9DA5B4]">No transitions available. This is a terminal state.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableTargets.map((target) => {
                const action = actionLabels[target] || { label: target, color: '#6B7280' };
                return (
                  <Button
                    key={target}
                    size="sm"
                    onClick={() => openConfirm(target)}
                    style={{ backgroundColor: action.color, color: '#fff' }}
                    className="hover:opacity-90"
                  >
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Transition History */}
      <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3D434F]">
          <h2 className="text-[20px] font-bold text-[#E8ECF1]">Transition History</h2>
          <span className="text-[13px] text-[#9DA5B4]">{transitions.length} transitions</span>
        </div>

        {transitions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[13px] text-[#9DA5B4]">No transitions yet. The current state is the initial state.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#3D434F50]">
            {transitions.map((t, idx) => (
              <div
                key={t.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#353942] transition-colors"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Date */}
                <div className="w-[180px] flex-shrink-0">
                  <p className="text-[13px] text-[#E8ECF1]">
                    {new Date(t.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    {new Date(t.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* User */}
                <div className="w-[160px] flex-shrink-0 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#4488FF] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                    {t.user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-[#E8ECF1] truncate">{t.user.name}</p>
                    <p className="text-[10px] text-[#6B7280] truncate">{t.user.email}</p>
                  </div>
                </div>

                {/* From → To */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {t.from ? <StatusBadge status={t.from} /> : <span className="text-[12px] text-[#6B7280]">—</span>}
                  <ArrowRight className="w-4 h-4 text-[#6B7280]" />
                  <StatusBadge status={t.to} />
                </div>

                {/* Reason */}
                <div className="flex-1 min-w-0 ml-4">
                  <p className="text-[12px] text-[#9DA5B4] truncate">{t.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="bg-[#2B2F38] border-[#3D434F] text-[#E8ECF1] max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${confirmDialog.targetState ? (actionLabels[confirmDialog.targetState]?.color || '#6B7280') : '#6B7280'}20`,
                }}
              >
                <AlertCircle
                  className="w-5 h-5"
                  style={{ color: confirmDialog.targetState ? (actionLabels[confirmDialog.targetState]?.color || '#6B7280') : '#6B7280' }}
                />
              </div>
              <DialogTitle className="text-[16px] font-bold text-[#E8ECF1]">
                {confirmDialog.targetState ? actionLabels[confirmDialog.targetState]?.label : 'Transition'} API?
              </DialogTitle>
            </div>
            <DialogDescription className="text-[13px] text-[#9DA5B4] pt-2">
              {confirmDialog.targetState ? warningTexts[confirmDialog.targetState] : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <label className="block text-[12px] font-medium text-[#9DA5B4]">
              Reason {(confirmDialog.targetState === 'DEPRECATED' || confirmDialog.targetState === 'RETIRED' || confirmDialog.targetState === 'BLOCKED') && <span className="text-[#EF4444]">*</span>}
            </label>
            <Textarea
              placeholder="Enter reason for this transition..."
              value={confirmDialog.reason}
              onChange={(e) => setConfirmDialog((prev) => ({ ...prev, reason: e.target.value }))}
              rows={3}
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, targetState: null, reason: '' })}
              className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
            >
              Cancel
            </Button>
            <Button
              onClick={executeTransition}
              disabled={!confirmDialog.reason.trim() && (confirmDialog.targetState === 'DEPRECATED' || confirmDialog.targetState === 'RETIRED' || confirmDialog.targetState === 'BLOCKED')}
              style={{
                backgroundColor: confirmDialog.targetState
                  ? (actionLabels[confirmDialog.targetState]?.color || '#4488FF')
                  : '#4488FF',
                color: '#fff',
              }}
              className="hover:opacity-90 disabled:opacity-40"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSS Animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
        @keyframes pulseRing {
          0%, 100% {
            box-shadow: 0 0 0 4px ${currentNode.color}30, 0 0 20px ${currentNode.color}20;
          }
          50% {
            box-shadow: 0 0 0 8px ${currentNode.color}15, 0 0 30px ${currentNode.color}30;
          }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Layout>
  );
}
