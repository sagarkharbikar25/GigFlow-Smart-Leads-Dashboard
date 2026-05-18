import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, Shield, AlertTriangle } from 'lucide-react';

// Form validation schema using Zod
const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please provide a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(32, 'Password cannot exceed 32 characters'),
  role: z.enum(['admin', 'sales'], {
    errorMap: () => ({ message: "Role must be 'admin' or 'sales'" }),
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'sales', // Default role selection
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      navigate('/');
    } catch (error: any) {
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 py-12 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-brand-secondary/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-primary/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-brand-secondary/10 rounded-2xl border border-brand-secondary/30 mb-3 shadow-glow-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-secondary">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">GigFlow</h1>
          <p className="text-brand-muted text-sm mt-1">Smart Leads Operations Dashboard</p>
        </div>

        {/* Register Form Card */}
        <div className="glass-panel rounded-3xl p-8 shadow-premium hover-glow">
          <h2 className="text-xl font-semibold text-white mb-6">Create Account</h2>

          {/* Error Message Callout */}
          {apiError && (
            <div className="mb-6 p-4 bg-brand-danger/10 border border-brand-danger/30 rounded-xl flex items-start space-x-3 text-brand-danger text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <input
                  type="text"
                  className={`w-full pl-12 pr-4 py-2.5 bg-brand-dark/50 border ${
                    errors.name ? 'border-brand-danger' : 'border-brand-border'
                  } rounded-xl text-white placeholder-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all`}
                  placeholder="Jane Doe"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-brand-danger font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <input
                  type="email"
                  className={`w-full pl-12 pr-4 py-2.5 bg-brand-dark/50 border ${
                    errors.email ? 'border-brand-danger' : 'border-brand-border'
                  } rounded-xl text-white placeholder-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all`}
                  placeholder="name@company.com"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-brand-danger font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full pl-12 pr-12 py-2.5 bg-brand-dark/50 border ${
                    errors.password ? 'border-brand-danger' : 'border-brand-border'
                  } rounded-xl text-white placeholder-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all`}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-brand-danger font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-brand-muted mb-2">Select User Role</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                <select
                  className="w-full pl-12 pr-4 py-2.5 bg-brand-dark/50 border border-brand-border rounded-xl text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer transition-all"
                  {...register('role')}
                >
                  <option value="sales" className="bg-brand-surface text-white">Sales User (Standard)</option>
                  <option value="admin" className="bg-brand-surface text-white">Administrator (Full Access)</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.role && (
                <p className="mt-1 text-xs text-brand-danger font-medium">{errors.role.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-4 bg-gradient-to-r from-brand-secondary to-brand-primary hover:brightness-110 active:scale-[0.99] text-white font-semibold rounded-xl transition-all shadow-glow-secondary/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>

          {/* Redirect to Login */}
          <p className="text-center text-sm text-brand-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-secondary hover:underline font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
