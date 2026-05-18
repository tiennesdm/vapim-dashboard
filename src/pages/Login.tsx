import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Hexagon,
  ArrowRight,
  Check,
  AlertCircle,
  Shield,
  Github,
  Chrome,
  Building2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ---- Floating Particles ----
interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function FloatingParticles() {
  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 4 + Math.random() * 4,
      duration: 15 + Math.random() * 15,
      delay: Math.random() * -30,
      opacity: 0.05 + Math.random() * 0.1,
    })),
  []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#4488FF]"
          style={{
            left: `${p.x}%`,
            bottom: '-20px',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ---- Dot Grid Background ----
function DotGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(circle, #1A1D23 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />
  );
}

// ---- Brand Mesh Gradient ----
function MeshGradient() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(at 15% 25%, rgba(68, 136, 255, 0.15) 0%, transparent 40%), radial-gradient(at 85% 75%, rgba(124, 92, 255, 0.12) 0%, transparent 40%)',
      }}
    />
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form when toggling
  useEffect(() => {
    setError('');
    setShake(false);
  }, [isRegister]);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (!agreeTerms) {
        setError('You must agree to the Terms of Service');
        return false;
      }
    }
    return true;
  };

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      // Use window.location for full page navigation to pick up auth state
      window.location.assign('/');
    } else {
      setError('Invalid email or password');
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0D0E12] relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background layers */}
      <MeshGradient />
      <DotGrid />
      <FloatingParticles />

      {/* CSS animation for floating particles */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--particle-opacity, 0.1); }
          90% { opacity: var(--particle-opacity, 0.1); }
          100% { transform: translateY(-110vh) translateX(${Math.random() > 0.5 ? '' : '-'}30px); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>

      {/* Login Card */}
      <div
        className={cn(
          'relative z-10 w-[420px] max-w-[90vw] bg-[#1A1D23] border border-[#3D434F] rounded-xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_#3D434F] transition-all duration-300 hover:shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_0_1px_#3D434F]',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          shake && 'animate-[shake_0.4s_ease-in-out]'
        )}
        style={{ transitionDelay: '100ms', transitionDuration: '400ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div
            className={cn(
              'inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#4488FF] mb-4 transition-all',
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            )}
            style={{ transitionDelay: '300ms', transitionDuration: '300ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <Hexagon className="w-7 h-7 text-white" />
          </div>
          <h2
            className={cn(
              'text-[20px] font-bold text-[#E8ECF1] transition-opacity',
              mounted ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: '400ms', transitionDuration: '200ms' }}
          >
            VedaDB API Manager
          </h2>
          <p
            className={cn(
              'text-[14px] text-[#9DA5B4] mt-1 transition-opacity',
              mounted ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: '500ms', transitionDuration: '200ms' }}
          >
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (register only) */}
          {isRegister && (
            <div>
              <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] h-11"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={cn(
                  'pl-10 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] h-11',
                  error && error.includes('email') && 'border-[#EF4444] focus:border-[#EF4444]'
                )}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-medium text-[#E8ECF1]">Password</label>
              {!isRegister && (
                <button type="button" className="text-[12px] text-[#4488FF] hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  'pl-10 pr-10 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] h-11',
                  error && error.includes('Password') && 'border-[#EF4444] focus:border-[#EF4444]'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#E8ECF1] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (register only) */}
          {isRegister && (
            <div>
              <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'pl-10 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] h-11',
                    error && error.includes('match') && 'border-[#EF4444] focus:border-[#EF4444]'
                  )}
                />
              </div>
            </div>
          )}

          {/* Organization (register only) */}
          {isRegister && (
            <div>
              <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Organization</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <Input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Acme Inc."
                  className="pl-10 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] h-11"
                />
              </div>
            </div>
          )}

          {/* Remember me / Terms */}
          {!isRegister ? (
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#3D434F] bg-[#181A20] text-[#4488FF] focus:ring-[#4488FF]"
              />
              <span className="text-[13px] text-[#9DA5B4]">Remember me for 30 days</span>
            </label>
          ) : (
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className={cn(
                  'w-4 h-4 rounded border-[#3D434F] bg-[#181A20] text-[#4488FF] focus:ring-[#4488FF] mt-0.5',
                  error && error.includes('Terms') && 'border-[#EF4444]'
                )}
              />
              <span className="text-[13px] text-[#9DA5B4]">
                I agree to the{' '}
                <button type="button" className="text-[#4488FF] hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-[#4488FF] hover:underline">Privacy Policy</button>
              </span>
            </label>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-[13px] text-[#EF4444] bg-[#EF444410] border border-[#EF444420] rounded-md px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#4488FF] text-white text-[14px] font-semibold hover:bg-[#5A9AFF] hover:shadow-[0_4px_12px_#4488FF30] active:bg-[#3366CC] active:scale-[0.98] transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isRegister ? 'Creating Account...' : 'Signing in...'}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#3D434F]" />
          <span className="text-[12px] text-[#6B7280] whitespace-nowrap">or continue with</span>
          <div className="flex-1 h-px bg-[#3D434F]" />
        </div>

        {/* SSO Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#2B2F38] border border-[#3D434F] rounded-lg text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF40] transition-all">
            <Chrome className="w-5 h-5" />
            <span className="text-[12px] hidden sm:inline">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#2B2F38] border border-[#3D434F] rounded-lg text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF40] transition-all">
            <Github className="w-5 h-5" />
            <span className="text-[12px] hidden sm:inline">GitHub</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#2B2F38] border border-[#3D434F] rounded-lg text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF40] transition-all">
            <Shield className="w-5 h-5" />
            <span className="text-[12px] hidden sm:inline">SSO</span>
          </button>
        </div>

        {/* Footer link */}
        <div className="mt-6 text-center">
          <span className="text-[13px] text-[#9DA5B4]">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          </span>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[13px] text-[#4488FF] hover:underline font-medium"
          >
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </div>
      </div>

      {/* Page Footer */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 py-4 text-center transition-opacity',
          mounted ? 'opacity-100' : 'opacity-0'
        )}
        style={{ transitionDelay: '1000ms', transitionDuration: '200ms' }}
      >
        <p className="text-[12px] text-[#6B7280]">
          © 2024 VedaDB Inc. All rights reserved. ·{' '}
          <button className="hover:text-[#9DA5B4] transition-colors">Privacy</button>
          {' · '}
          <button className="hover:text-[#9DA5B4] transition-colors">Terms</button>
          {' · '}
          <button className="hover:text-[#9DA5B4] transition-colors">Support</button>
        </p>
      </div>
    </div>
  );
}
