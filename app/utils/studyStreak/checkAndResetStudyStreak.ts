// import { SupabaseClient } from "@supabase/supabase-js";
import { UserStudyType } from "@/types/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkAndResetStudyStreak = async (supabase: any, userId: string): Promise<number> => {
  try {
    const { data: profileData, error: profileFetchError } = await supabase.from("user_profiles").select("last_study_date, study_streak").eq("id", userId).single();

    if (profileFetchError) {
      console.error("Error fetching profile data:", profileFetchError);
      return 0;
    }

    if (!profileData) {
      console.error("No profile data found");
      return 0;
    }

    const typedProfileData = profileData as UserStudyType;
    const lastStudyDate = typedProfileData.last_study_date ? new Date(typedProfileData.last_study_date) : null;
    const currentStreak = typedProfileData.study_streak || 0;

    // If no last study date, return current streak (probably 0)
    if (!lastStudyDate) {
      return currentStreak;
    }

    const now = new Date();

    // Create date objects for comparison (without time)
    const lastStudyDateOnly = new Date(lastStudyDate.getFullYear(), lastStudyDate.getMonth(), lastStudyDate.getDate());
    const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Calculate the difference in days
    const timeDifference = todayOnly.getTime() - lastStudyDateOnly.getTime();
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    // If 2 or more days have passed since last study, reset streak
    if (daysDifference >= 2) {
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          study_streak: 0,
        })
        .eq("id", userId);

      if (profileError) {
        console.error("Error resetting study streak:", profileError);
        return currentStreak; // Return original streak if update failed
      }

      return 0; // Return the new reset streak
    }

    // If less than 2 days, return current streak unchanged
    return currentStreak;
  } catch (error) {
    console.error("Error checking study streak:", error);
    return 0;
  }
};
