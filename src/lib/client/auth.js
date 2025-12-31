"use client";
import { db_client } from "./client_db";
import { signup_rpc } from "../shared/db_rpcs";

/**
 * Login a user with email and password
 * Returns { session, user } on success or { error } on failure
 */
export async function login(email, password) {
  const { data, error } = await db_client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let customMessage = "Login failed";
    if (error.status === 400) customMessage = "Invalid email or password";
    else if (error.status === 429) customMessage = "Too many attempts. Try again later.";
    return { data: null, error: customMessage };
  }

  const { user, session } = data;

  if (!user.email_confirmed_at) {
    return { data: null, error: "Email not confirmed" };
  }

  return { data: { session, user }, error: null };
}

/**
 * Logout the current user
 */
export async function logout() {
  const { error } = await db_client.auth.signOut();
  if (error) throw error;
  return;
}

/**
 * Sign up a new user with email and password
 * Returns user data if successful
 */
export async function signup(email, password) {
  const { data, error } = await db_client.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/verify-email` },
  });

  if (error) {
    let customMessage = "Signup failed";
    if (error.status === 400) customMessage = "Invalid email or password";
    else if (error.status === 429) customMessage = "Too many attempts. Try again later.";
    return { data: null, error: customMessage };
  }

  // sign up user if there is no error. use rpc to check existing records then add if not, 
  // return fail or succeed
  const signup_res = signup_rpc(db_client, email)
  if (!signup_res) {
    return { data, error: null};
  }

  return { data, error: null };
}

/**
 * Trigger a password reset email
 * The user will receive a link to reset the password
 */
export async function resetPassword(email) {
  const { data, error } = await db_client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });

  if (error) {
    let customMessage = "Password reset failed";
    if (error.status === 400) customMessage = "Invalid email address";
    else if (error.status === 429) customMessage = "Too many attempts. Try again later.";
    return { data: null, error: customMessage };
  }

  return { data, error: null };
}

/**
 * Get the current session and user
 */
export async function getSession() {
  const {data: { session }} = await db_client.auth.getSession();
  return session;
}

export async function getUser() {
  const { data: { user }, error } = await db_client.auth.getUser()
  if (error) throw error
  return user
}