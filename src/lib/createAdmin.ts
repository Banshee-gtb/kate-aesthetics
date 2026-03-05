import { supabase } from './supabase';
import { FunctionsHttpError } from '@supabase/supabase-js';

export async function createAdminUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.functions.invoke('create-admin', {
      body: { email, password },
    });

    if (error) {
      let errorMessage = error.message;
      if (error instanceof FunctionsHttpError) {
        try {
          const statusCode = error.context?.status ?? 500;
          const textContent = await error.context?.text();
          errorMessage = `[Code: ${statusCode}] ${textContent || error.message || 'Unknown error'}`;
          console.error('Edge function error:', errorMessage);
        } catch {
          errorMessage = `${error.message || 'Failed to read response'}`;
        }
      }
      throw new Error(errorMessage);
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to create admin:', error);
    return { success: false, error: error.message };
  }
}
