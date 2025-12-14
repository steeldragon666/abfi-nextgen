-- Migration: User Experience Enhancements
-- Adds notification preferences, announcements, inquiry messages, and rating history

-- ============================================
-- NOTIFICATION PREFERENCES
-- ============================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Email notifications
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  email_inquiry_received BOOLEAN NOT NULL DEFAULT true,
  email_inquiry_response BOOLEAN NOT NULL DEFAULT true,
  email_verification_updates BOOLEAN NOT NULL DEFAULT true,
  email_new_matches BOOLEAN NOT NULL DEFAULT true,
  email_price_alerts BOOLEAN NOT NULL DEFAULT true,
  email_weekly_digest BOOLEAN NOT NULL DEFAULT false,

  -- In-app notifications
  inapp_enabled BOOLEAN NOT NULL DEFAULT true,
  inapp_inquiry_updates BOOLEAN NOT NULL DEFAULT true,
  inapp_system_alerts BOOLEAN NOT NULL DEFAULT true,
  inapp_feedstock_updates BOOLEAN NOT NULL DEFAULT true,

  -- Frequency
  digest_frequency TEXT NOT NULL DEFAULT 'instant' CHECK (digest_frequency IN ('instant', 'daily', 'weekly', 'never')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_notification_prefs_user ON notification_preferences(user_id);

-- ============================================
-- INQUIRY MESSAGES (Conversation Thread)
-- ============================================
CREATE TABLE IF NOT EXISTS inquiry_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),

  message_type TEXT NOT NULL DEFAULT 'message' CHECK (message_type IN ('message', 'system', 'offer', 'counter_offer')),
  content TEXT NOT NULL,

  -- For offers
  offered_price NUMERIC,
  offered_volume NUMERIC,

  -- Attachments
  attachments JSONB DEFAULT '[]',

  -- Read status
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inquiry_messages_inquiry ON inquiry_messages(inquiry_id);
CREATE INDEX idx_inquiry_messages_sender ON inquiry_messages(sender_id);
CREATE INDEX idx_inquiry_messages_unread ON inquiry_messages(inquiry_id, read_at) WHERE read_at IS NULL;

-- ============================================
-- ANNOUNCEMENTS (Content Management)
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,

  -- Targeting
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'suppliers', 'buyers', 'auditors', 'admins')),

  -- Type and priority
  announcement_type TEXT NOT NULL DEFAULT 'info' CHECK (announcement_type IN ('info', 'warning', 'maintenance', 'feature', 'policy')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),

  -- Display settings
  show_banner BOOLEAN NOT NULL DEFAULT false,
  banner_color TEXT,

  -- Publishing
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Author
  created_by UUID NOT NULL REFERENCES profiles(id),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_target ON announcements(target_audience);
CREATE INDEX idx_announcements_published ON announcements(published_at) WHERE status = 'published';

-- Dismissed announcements tracking
CREATE TABLE IF NOT EXISTS announcement_dismissals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_announcement_dismissals_unique ON announcement_dismissals(announcement_id, user_id);

-- ============================================
-- RATING HISTORY (Score Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS rating_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- What was rated
  entity_type TEXT NOT NULL CHECK (entity_type IN ('feedstock', 'supplier', 'ci_report')),
  entity_id UUID NOT NULL,

  -- Scores
  abfi_score NUMERIC,
  ci_rating TEXT,
  ci_value NUMERIC,

  -- Component scores (for feedstocks)
  sustainability_score NUMERIC,
  supply_reliability_score NUMERIC,
  quality_score NUMERIC,
  traceability_score NUMERIC,

  -- What triggered the update
  trigger_type TEXT CHECK (trigger_type IN ('initial', 'recalculation', 'verification', 'document_upload', 'manual')),
  trigger_notes TEXT,

  -- Metadata
  calculated_by UUID REFERENCES profiles(id),
  calculation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rating_history_entity ON rating_history(entity_type, entity_id);
CREATE INDEX idx_rating_history_date ON rating_history(calculation_date);

-- ============================================
-- AUDIT LOG ENHANCEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Who performed the action
  user_id UUID REFERENCES profiles(id),
  user_email TEXT,
  user_role TEXT,

  -- What action was performed
  action TEXT NOT NULL,
  action_category TEXT CHECK (action_category IN ('auth', 'data', 'admin', 'verification', 'system')),

  -- What entity was affected
  entity_type TEXT,
  entity_id UUID,
  entity_name TEXT,

  -- Details
  old_values JSONB,
  new_values JSONB,
  metadata JSONB,

  -- Request context
  ip_address TEXT,
  user_agent TEXT,

  -- Result
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_category ON audit_logs(action_category);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_dismissals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rating_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Notification preferences: Users can manage their own
CREATE POLICY "Users can manage own preferences" ON notification_preferences
  FOR ALL USING (user_id = auth.uid());

-- Inquiry messages: Participants can view/send
CREATE POLICY "Inquiry participants can view messages" ON inquiry_messages
  FOR SELECT USING (
    inquiry_id IN (
      SELECT id FROM inquiries WHERE
        buyer_id IN (SELECT id FROM buyers WHERE profile_id = auth.uid())
        OR supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid())
    )
  );

CREATE POLICY "Inquiry participants can send messages" ON inquiry_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    inquiry_id IN (
      SELECT id FROM inquiries WHERE
        buyer_id IN (SELECT id FROM buyers WHERE profile_id = auth.uid())
        OR supplier_id IN (SELECT id FROM suppliers WHERE profile_id = auth.uid())
    )
  );

-- Announcements: All can view published, admins can manage
CREATE POLICY "All users can view published announcements" ON announcements
  FOR SELECT USING (
    status = 'published' AND
    (expires_at IS NULL OR expires_at > NOW())
  );

CREATE POLICY "Admins can manage announcements" ON announcements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Announcement dismissals: Users can manage own
CREATE POLICY "Users can manage own dismissals" ON announcement_dismissals
  FOR ALL USING (user_id = auth.uid());

-- Rating history: Public read for verified entities
CREATE POLICY "Public can view rating history" ON rating_history
  FOR SELECT USING (true);

-- Audit logs: Only admins can view
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- ============================================
-- HELPER FUNCTION: Record Rating Change
-- ============================================
CREATE OR REPLACE FUNCTION record_rating_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO rating_history (
    entity_type,
    entity_id,
    abfi_score,
    sustainability_score,
    supply_reliability_score,
    quality_score,
    traceability_score,
    trigger_type
  ) VALUES (
    'feedstock',
    NEW.id,
    NEW.abfi_score,
    NEW.sustainability_score,
    NEW.supply_reliability_score,
    NEW.quality_score,
    NEW.traceability_score,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'initial'
      ELSE 'recalculation'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to record feedstock score changes
CREATE TRIGGER track_feedstock_ratings
  AFTER INSERT OR UPDATE OF abfi_score ON feedstocks
  FOR EACH ROW
  WHEN (NEW.abfi_score IS NOT NULL)
  EXECUTE FUNCTION record_rating_change();

-- ============================================
-- GRANTS
-- ============================================
GRANT SELECT, INSERT, UPDATE, DELETE ON notification_preferences TO authenticated;
GRANT SELECT, INSERT ON inquiry_messages TO authenticated;
GRANT SELECT ON announcements TO authenticated;
GRANT SELECT, INSERT, DELETE ON announcement_dismissals TO authenticated;
GRANT SELECT ON rating_history TO authenticated;
GRANT SELECT, INSERT ON audit_logs TO authenticated;
