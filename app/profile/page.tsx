'use client'
// app/profile/page.tsx

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { User, Lock, Save, Loader2, Shield, Phone, Mail } from 'lucide-react'
import { useAuth, useApi } from '@/hooks/useAuth'
import DashboardShell from '@/components/dashboard/DashboardShell'

const profileSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().regex(/^(?:254|\+254|0)?(7[0-9]{8}|1[0-9]{8})$/, 'Valid Kenyan phone required'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { user, fetchMe } = useAuth()
  const api = useApi()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: user?.fullName || '', phone: user?.phone || '' },
  })

  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  const onSaveProfile = async (data: ProfileForm) => {
    setSavingProfile(true)
    try {
      const res = await api.patch('/api/auth/profile', data)
      if (res.success) {
        toast.success('Profile updated successfully!')
        fetchMe()
      } else {
        toast.error(res.error || 'Update failed')
      }
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangePassword = async (data: PasswordForm) => {
    setSavingPassword(true)
    try {
      const res = await api.post('/api/auth/password', data)
      if (res.success) {
        toast.success('Password changed!')
        passwordForm.reset()
      } else {
        toast.error(res.error || 'Password change failed')
      }
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
        </div>

        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5"
        >
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm flex-shrink-0">
            {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">{user?.fullName}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              <Shield className="w-3 h-3" />
              {user?.role}
            </span>
          </div>
        </motion.div>

        {/* Profile form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            <h2 className="font-bold text-gray-900 text-sm">Personal Information</h2>
          </div>
          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                {...profileForm.register('fullName')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 focus:bg-white"
              />
              {profileForm.formState.errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" />Email Address</span>
              </label>
              <input
                value={user?.email}
                disabled
                className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support if needed.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" />Phone Number</span>
              </label>
              <input
                {...profileForm.register('phone')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 focus:bg-white"
              />
              {profileForm.formState.errors.phone && (
                <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.phone.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-sm disabled:opacity-60"
            >
              {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </motion.div>

        {/* Password form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-600" />
            <h2 className="font-bold text-gray-900 text-sm">Change Password</h2>
          </div>
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="p-6 space-y-4">
            {[
              { name: 'currentPassword' as const, label: 'Current Password' },
              { name: 'newPassword' as const, label: 'New Password' },
              { name: 'confirmPassword' as const, label: 'Confirm New Password' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <input
                  {...passwordForm.register(name)}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 focus:bg-white ${
                    passwordForm.formState.errors[name] ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {passwordForm.formState.errors[name] && (
                  <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors[name]?.message}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-sm disabled:opacity-60"
            >
              {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Update Password
            </button>
          </form>
        </motion.div>
      </div>
    </DashboardShell>
  )
}
