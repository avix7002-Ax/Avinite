import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { AviniteLogo } from '@/components/AviniteLogo';
import { supabase } from '@/lib/supabase';

type Phase = 'validating' | 'ready' | 'success' | 'error' | 'expired';

const INVALID_LINK_MESSAGE = 'This password reset link is invalid, expired, or has already been used.';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('validating');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const recoveryEventRef = useRef(false);
  const validationInFlightRef = useRef(false);
  const validationAttemptsRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    let retryTimer: number | undefined;

    const validateRecoverySession = async () => {
      if (!mounted || validationInFlightRef.current) return;
      validationInFlightRef.current = true;

      try {
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
        const queryParams = url.searchParams;
        const callbackError = hashParams.get('error') || hashParams.get('error_code') || queryParams.get('error');
        const recoveryFromUrl = hashParams.get('type') === 'recovery' || queryParams.get('type') === 'recovery';
        const hasAuthCallback = recoveryFromUrl || queryParams.has('code') || hashParams.has('access_token');

        if (callbackError) {
          setErrorMsg(INVALID_LINK_MESSAGE);
          setPhase('expired');
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (!mounted) return;

        if (sessionError || !session?.user) {
          if (hasAuthCallback && validationAttemptsRef.current < 12) {
            validationAttemptsRef.current += 1;
            setPhase('validating');
            retryTimer = window.setTimeout(() => { void validateRecoverySession(); }, 250);
            return;
          }
          setErrorMsg(INVALID_LINK_MESSAGE);
          setPhase('expired');
          return;
        }

        const isRecoverySession = recoveryEventRef.current || recoveryFromUrl;
        if (!isRecoverySession) {
          setErrorMsg(INVALID_LINK_MESSAGE);
          setPhase('expired');
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (!mounted) return;

        if (userError || !user) {
          setErrorMsg(INVALID_LINK_MESSAGE);
          setPhase('expired');
          return;
        }

        setPhase('ready');
        window.history.replaceState({}, document.title, window.location.pathname);
      } finally {
        validationInFlightRef.current = false;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        recoveryEventRef.current = true;
        window.setTimeout(() => { void validateRecoverySession(); }, 0);
      }
    });

    void validateRecoverySession();

    return () => {
      mounted = false;
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (phase !== 'ready') return;

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes('token') || message.includes('expired') || message.includes('invalid') || message.includes('session')) {
        setErrorMsg(INVALID_LINK_MESSAGE);
        setPhase('expired');
      } else {
        setErrorMsg('Unable to update your password. Please try again.');
        setPhase('error');
      }
      return;
    }

    await supabase.auth.signOut({ scope: 'local' });
    setPhase('success');
    setTimeout(() => navigate('/login'), 3000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-2">
            <AviniteLogo size={40} />
            <span className="font-display">Avinite <span className="gradient-text-brand">AI</span></span>
          </Link>
        </div>

        {phase === 'validating' && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 animate-pulse mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Verifying your reset link...</p>
            </CardContent>
          </Card>
        )}

        {phase === 'expired' && (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Link Expired
              </CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired. Reset links are only valid for a limited time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please request a new password reset link from the login page.
              </p>
              <Link to="/login">
                <Button className="w-full">
                  Back to Login <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {phase === 'error' && (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Something Went Wrong
              </CardTitle>
              <CardDescription>{errorMsg || 'We could not process your request. Please try again.'}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/login">
                <Button className="w-full">
                  Back to Login <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {phase === 'success' && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600/10 mb-4">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">Password Updated!</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Your password has been changed successfully. Redirecting to login...
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm">Go to Login now</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {phase === 'ready' && (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Set New Password</CardTitle>
              <CardDescription>Enter your new password below to secure your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                    Passwords do not match
                  </p>
                )}

                {errorMsg && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{errorMsg}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading || (password !== confirmPassword)}>
                  {loading ? 'Updating password...' : 'Update Password'}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                Make sure your new password is at least 6 characters and hard to guess.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
