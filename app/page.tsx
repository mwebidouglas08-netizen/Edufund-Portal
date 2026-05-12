'use client'
// app/page.tsx — Landing Page

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GraduationCap, BookOpen, Users, CheckCircle, ArrowRight,
  Star, Shield, Clock, Award, ChevronRight, Zap, TrendingUp,
  FileText, CreditCard, Bell
} from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Grace Wanjiru Kamau',
    role: 'Engineering Student, University of Nairobi',
    county: 'Kiambu County',
    text: 'EduFund Portal helped me secure my bursary funding in just 2 weeks. The process was straightforward and the status tracking kept me informed throughout.',
    amount: 'KES 25,000',
    avatar: 'GW',
  },
  {
    name: 'Samuel Otieno Auma',
    role: 'Medicine Student, Moi University',
    county: 'Kisumu County',
    text: 'As an orphan, I was worried about funding my medical education. This platform connected me to the right bursary and the M-Pesa payment was seamless.',
    amount: 'KES 40,000',
    avatar: 'SO',
  },
  {
    name: 'Faith Chebet Yego',
    role: 'Nursing Student, KMTC Eldoret',
    county: 'Uasin Gishu County',
    text: 'I love how transparent everything is. I could track my application from submission to approval. Received my disbursement notification via email and SMS.',
    amount: 'KES 18,000',
    avatar: 'FC',
  },
]

const PARTNERS = [
  'University of Nairobi', 'Kenyatta University', 'Moi University',
  'JKUAT', 'Strathmore University', 'Kenya Medical Training College',
  'Technical University of Kenya', 'Egerton University',
]

const HOW_IT_WORKS = [
  { step: '01', icon: FileText, title: 'Complete Application', desc: 'Fill out our comprehensive 5-step form with your personal, academic, and financial details.' },
  { step: '02', icon: CreditCard, title: 'Pay Application Fee', desc: 'Securely pay the KES 500 application fee via M-Pesa STK Push — quick and safe.' },
  { step: '03', icon: Users, title: 'Expert Review', desc: 'Our team reviews your application and supporting documents thoroughly.' },
  { step: '04', icon: Award, title: 'Receive Funding', desc: 'Approved applicants receive funding directly to their institution or account.' },
]

const STATS = [
  { value: '12,400+', label: 'Students Funded' },
  { value: 'KES 180M+', label: 'Disbursed' },
  { value: '47', label: 'Counties Served' },
  { value: '98%', label: 'Satisfaction Rate' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">EduFund</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
              <a href="#institutions" className="hover:text-brand-600 transition-colors">Institutions</a>
              <a href="#testimonials" className="hover:text-brand-600 transition-colors">Stories</a>
              <a href="#bursaries" className="hover:text-brand-600 transition-colors">Bursaries</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-800 to-blue-900" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Applications Open for 2025 Academic Year
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Funding Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                  Educational Journey
                </span>
                Across Kenya
              </h1>

              <p className="mt-6 text-lg text-blue-100 leading-relaxed max-w-xl">
                Apply for bursaries, track your application status in real-time, and access
                educational funding opportunities from government and partner institutions.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold text-base rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95 group"
                >
                  Apply for Bursary
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold text-base rounded-xl hover:bg-white/20 transition-all"
                >
                  Track Application
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap gap-6">
                {[
                  { icon: Shield, text: 'Secure & Verified' },
                  { icon: Zap, text: 'Fast Processing' },
                  { icon: Bell, text: 'Real-time Updates' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-white/70 text-sm">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero image / stats card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main stats card */}
                <div className="glass-dark rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Funding Overview</p>
                      <p className="text-white/50 text-xs">2025 Academic Year</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {STATS.map((stat) => (
                      <div key={stat.label} className="bg-white/10 rounded-xl p-4 border border-white/10">
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-white/60 text-xs mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent applications */}
                  <div className="space-y-3">
                    {[
                      { name: 'G. Kamau', institution: 'UoN - Engineering', status: 'Approved', color: 'bg-emerald-500' },
                      { name: 'S. Otieno', institution: 'Moi - Medicine', status: 'Disbursed', color: 'bg-purple-500' },
                      { name: 'F. Chebet', institution: 'KMTC - Nursing', status: 'Under Review', color: 'bg-amber-500' },
                    ].map((app) => (
                      <div key={app.name} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-600/50 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {app.name[0]}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{app.name}</p>
                            <p className="text-white/50 text-xs">{app.institution}</p>
                          </div>
                        </div>
                        <span className={`${app.color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating notification card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 glass-dark rounded-xl p-4 border border-white/10 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Approved!</p>
                      <p className="text-white/50 text-xs">KES 25,000 disbursed</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-brand-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Get Funded in 4 Easy Steps
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Our streamlined application process ensures you spend less time on paperwork
              and more time on your education.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                    <item.icon className="w-6 h-6 text-brand-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-5xl font-black text-gray-100 leading-none">{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 hidden lg:block" />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-12"
          >
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-md hover:shadow-lg active:scale-95 group"
            >
              Start Your Application
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Partner Institutions */}
      <section id="institutions" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Recognized Institutions</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              Serving Students Across Kenya
            </h2>
          </motion.div>

          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-marquee" style={{ '--duration': '30s' } as React.CSSProperties}>
              {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium text-sm whitespace-nowrap hover:border-brand-300 hover:bg-brand-50 transition-colors cursor-default"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-brand-950 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="text-blue-300 font-semibold text-sm uppercase tracking-wider">Student Stories</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Lives Changed Through Education
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/50 text-xs">{t.role}</p>
                    <p className="text-emerald-400 text-xs font-semibold mt-0.5">Received {t.amount}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-wider">Platform Features</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-8">
                Everything You Need to
                <span className="text-brand-600"> Secure Funding</span>
              </h2>
              <div className="space-y-6">
                {[
                  { icon: FileText, title: 'Multi-Step Application', desc: 'Our guided 5-step form ensures you provide all necessary information for a successful application.' },
                  { icon: CreditCard, title: 'M-Pesa Payment', desc: 'Pay the application fee securely via Lipa Na M-Pesa. No bank visits required.' },
                  { icon: Clock, title: 'Real-Time Tracking', desc: 'Monitor your application status with a visual timeline from submission to disbursement.' },
                  { icon: Bell, title: 'Instant Notifications', desc: 'Receive email and in-app notifications for every status change on your application.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center mt-1">
                      <Icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{title}</h3>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-3xl p-8 border border-brand-100"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-gray-900">Application Progress</p>
                  <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-1 rounded-full">EDF-2025-084291</span>
                </div>
                <div className="space-y-3">
                  {['Submitted', 'Under Review', 'Approved', 'Disbursed'].map((stage, idx) => (
                    <div key={stage} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${idx < 3 ? 'bg-emerald-500' : 'bg-gray-100'}`}>
                        {idx < 3 ? <CheckCircle className="w-4 h-4 text-white" /> : <span className="w-2 h-2 bg-gray-300 rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${idx < 3 ? 'text-gray-900' : 'text-gray-400'}`}>{stage}</span>
                          {idx < 3 && <span className="text-xs text-gray-400">2 days ago</span>}
                        </div>
                        {idx < 3 && (
                          <div className="w-full h-1 bg-emerald-100 rounded-full mt-1">
                            <div className="h-1 bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Congratulations! Application Approved</span>
                </div>
                <p className="text-emerald-600 text-sm mt-1">KES 25,000 disbursement initiated</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <BookOpen className="w-12 h-12 text-blue-200 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Fund Your Education?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of Kenyan students who have secured educational funding through
              EduFund Portal. Applications are open now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold text-base rounded-xl hover:bg-blue-50 transition-all shadow-md hover:shadow-lg active:scale-95 group"
              >
                Apply Now — Free Registration
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-semibold text-base rounded-xl hover:bg-white/20 transition-all"
              >
                Track Existing Application
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">EduFund Portal</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Empowering Kenyan students through accessible educational funding.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Apply for Bursary', 'Track Application', 'Institutions Directory', 'Active Bursaries'] },
              { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQs', 'Documentation'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Data Protection', 'Accessibility'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="font-semibold text-white text-sm mb-3">{title}</p>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} EduFund Portal. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm">
              Made with ❤️ for Kenyan Students | M-Pesa powered by Lipana
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
