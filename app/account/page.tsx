"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      if (isLogin) {
        // Login logic
        if (!otpSent) {
          // Request OTP
          const otpResponse = await fetch("/api/auth/otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          })

          if (!otpResponse.ok) {
            throw new Error("Failed to send OTP")
          }

          setOtpSent(true)
          setMessage({ type: "success", text: "OTP sent to your email" })
        } else {
          // Verify OTP and login
          const loginResponse = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, otp }),
          })

          if (!loginResponse.ok) {
            const errorData = await loginResponse.json()
            throw new Error(errorData.error || "Login failed")
          }

          setMessage({ type: "success", text: "Login successful" })

          // Redirect after successful login
          if (redirect) {
            router.push(`/${redirect}`)
          } else {
            router.push("/")
          }
        }
      } else {
        // Signup logic
        if (password !== confirmPassword) {
          setMessage({ type: "error", text: "Passwords do not match" })
          setLoading(false)
          return
        }

        const signupResponse = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        if (!signupResponse.ok) {
          const errorData = await signupResponse.json()
          throw new Error(errorData.error || "Signup failed")
        }

        setMessage({
          type: "success",
          text: "Successfully signed up! Please log in.",
        })

        // Reset form and switch to login
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setIsLogin(true)
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setMessage({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setOtp("")
    setOtpSent(false)
    setMessage({ type: "", text: "" })
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">{isLogin ? "Login to Your Account" : "Create an Account"}</h1>

      {message.text && (
        <div
          className={`p-4 mb-4 rounded ${
            message.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
        )}

        {isLogin && otpSent && (
          <div>
            <label className="block mb-1">One-Time Password (OTP)</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Processing..." : isLogin ? (otpSent ? "Login" : "Send OTP") : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setIsLogin(!isLogin)
            resetForm()
          }}
          className="text-blue-600 hover:underline"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  )
}

