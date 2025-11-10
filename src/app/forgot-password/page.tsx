'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ForgotPasswordPage() {
  const [contactValue, setContactValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative">
        <button
          onClick={() => router.push('/login')}
          className="absolute -top-12 left-0 flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-medium">Back to login</span>
        </button>

        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">CT</span>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-neutral-900">Reset your password</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Enter the email address or phone number associated with your account and our team will
            reach out with the next steps.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-8">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                ✓
              </div>
              <h2 className="text-lg font-semibold text-neutral-900">Request received</h2>
              <p className="text-sm text-neutral-600">
                Our support team will contact you shortly to help reset your password. If this is
                urgent, you can also email us directly at{' '}
                <a
                  href="mailto:support@campusteranga.com"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  support@campusteranga.com
                </a>
                .
              </p>
              <Link
                href="/login"
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="contactValue"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
                  Email address or phone number
                </label>
                <input
                  id="contactValue"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="you@example.com or +221 77 123 45 67"
                  value={contactValue}
                  onChange={(event) => setContactValue(event.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
              >
                Send reset request
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-neutral-500 text-center">
          If you continue to have trouble accessing your account, please contact the campus Teranga
          support team.
        </p>
      </div>
    </div>
  )
}

