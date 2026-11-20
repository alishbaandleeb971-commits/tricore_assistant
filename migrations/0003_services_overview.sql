-- Migration 0003: Add Services Overview knowledge entry and chunk
INSERT OR IGNORE INTO knowledge_entry (id, service_id, entry_type, title, keywords, status)
VALUES (
  'e0000000-0000-0000-0000-000000000001',
  NULL,
  'service',
  'Services Overview',
  'services, what services do you offer, services list, offerings, our services, what do you do, all services, offer',
  'approved'
);

INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, is_live)
VALUES (
  'e0000000-0000-0000-0000-000000000002',
  'e0000000-0000-0000-0000-000000000001',
  1,
  'TriCore Digital Tech provides end-to-end digital and AI solutions across 8 core service domains: AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development, and WordPress Development.',
  'approved',
  1
);

INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq)
VALUES (
  'e0000000-0000-0000-0000-000000000003',
  'e0000000-0000-0000-0000-000000000002',
  'TriCore Digital Tech provides end-to-end digital and AI solutions across 8 core service domains: AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development, and WordPress Development.',
  'Services Overview',
  'services, what services do you offer, services list, offerings, our services, what do you do, all services, offer',
  0
);

INSERT OR IGNORE INTO release_item (release_id, entry_version_id)
VALUES (
  '8a9bb867-6dbb-4f64-83a9-392815499d72',
  'e0000000-0000-0000-0000-000000000002'
);
