import type { ShippingInfo } from '../types/checkout'
import type { LoginFormValues } from '../types/user'

export type LoginErrors = Partial<Record<keyof LoginFormValues, string>>
export type CheckoutErrors = Partial<Record<keyof ShippingInfo, string>>

export function validateLogin(values: LoginFormValues): LoginErrors {
  const errors: LoginErrors = {}

  if (values.username.trim() === '') {
    errors.username = 'Username is required'
  }

  if (values.password === '') {
    errors.password = 'Password is required'
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  return errors
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateCheckout(values: ShippingInfo): CheckoutErrors {
  const errors: CheckoutErrors = {}

  if (values.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters'
  }

  const email = values.email.trim()

  if (email === '') {
    errors.email = 'Email is required'
  } else if (!emailPattern.test(email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (values.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters'
  }

  if (values.city.trim() === '') {
    errors.city = 'City is required'
  }

  return errors
}
