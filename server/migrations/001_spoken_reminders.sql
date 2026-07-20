-- Spoken reminder preferences are separate so existing local/account settings remain intact.
create table if not exists user_spoken_reminder_settings (
  user_id text primary key,
  spoken_reminders_enabled boolean not null default false,
  reminder_tts_model text not null default 'chatterbox-english',
  reminder_voice_id text not null default 'default-english',
  reminder_language text not null default 'en',
  reminder_volume numeric(3, 2) not null default 0.85,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_spoken_reminder_volume_range check (reminder_volume >= 0 and reminder_volume <= 1)
);

create index if not exists user_spoken_reminder_settings_updated_at_idx
  on user_spoken_reminder_settings (updated_at);
