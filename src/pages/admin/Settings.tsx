import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  terms: string;
  privacy: string;
}

export function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    terms: '',
    privacy: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .in('key', ['terms', 'privacy']);

      if (error) throw error;

      const settingsMap: any = {};
      data?.forEach((item) => {
        settingsMap[item.key] = item.value || '';
      });

      setSettings({
        terms: settingsMap.terms || '',
        privacy: settingsMap.privacy || '',
      });
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error loading settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [
        { key: 'terms', value: settings.terms },
        { key: 'privacy', value: settings.privacy },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('settings')
          .upsert(
            {
              key: update.key,
              value: update.value,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'key' }
          );

        if (error) throw error;
      }

      toast({
        title: 'Settings saved',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error saving settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage site-wide settings and policies</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
          <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
          <Textarea
            value={settings.terms}
            onChange={(e) => setSettings({ ...settings, terms: e.target.value })}
            placeholder="Enter your terms and conditions..."
            className="min-h-[200px]"
          />
        </div>

        <div className="p-6 rounded-lg bg-gradient-card backdrop-blur-soft border border-border">
          <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
          <Textarea
            value={settings.privacy}
            onChange={(e) => setSettings({ ...settings, privacy: e.target.value })}
            placeholder="Enter your privacy policy..."
            className="min-h-[200px]"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
