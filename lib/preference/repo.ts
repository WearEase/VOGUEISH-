import { User } from "@/models/UserSchema";
import { connectDB } from "../db";
import { ExtractedPref } from "./parser";

export async function updateUserPromptsAndPreferences(userId: string, prompt: string, pref: ExtractedPref) {
  await connectDB();
  
  // Find user and update
  const user = await User.findById(userId);
  if (!user) return;

  // Append new prompt
  if (prompt) {
    user.prompts.push(prompt);
  }

  // Update preferences by merging
  if (!user.preferences) {
    user.preferences = { occasions: [], styles: [], colors: [] };
  }

  if (pref.occasions) {
    user.preferences.occasions = [...new Set([...(user.preferences.occasions || []), ...pref.occasions])];
  }
  if (pref.styles) {
    user.preferences.styles = [...new Set([...(user.preferences.styles || []), ...pref.styles])];
  }
  if (pref.colors) {
    user.preferences.colors = [...new Set([...(user.preferences.colors || []), ...pref.colors])];
  }
  if (pref.budget?.max) {
    user.preferences.budget = { ...user.preferences.budget, max: pref.budget.max };
  }
  if (pref.gender) {
    user.preferences.gender = pref.gender;
  }

  await user.save();
}

export async function getUserPreferences(userId: string) {
  await connectDB();
  const user = await User.findById(userId).select('preferences');
  return user?.preferences || null;
}
