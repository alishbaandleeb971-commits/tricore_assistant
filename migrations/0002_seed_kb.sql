INSERT OR IGNORE INTO staff_user (id, email, role, status, created_at) VALUES ('645ee146-1ffc-4832-a412-cea7c06e43e2', 'admin@tricoredigitaltech.com', 'admin', 'active', 1794725870622);
INSERT OR IGNORE INTO knowledge_release (id, release_no, published_at, published_by, status) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 1, 1794725870622, '645ee146-1ffc-4832-a412-cea7c06e43e2', 'published');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('8d9f700b-a5d2-4bd2-820f-f0be9f3e02e0', 'service', 'AI Services', 'AI, artificial intelligence, AI automation, automation, chatbot, AI chatbot, AI assistant, workflow automation, AI agent, machine learning, AI integration, GPT, LLM', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('a4aba0a9-1a77-47af-8dcb-53a59fcf2ce5', '8d9f700b-a5d2-4bd2-820f-f0be9f3e02e0', 1, 'TriCore''s AI Services help businesses use artificial intelligence to save time and serve customers better. This includes AI chatbots and assistants for websites, automation of repetitive tasks, and connecting AI tools to the software a business already uses.

**Benefits:** less manual work, faster replies to customers, round-the-clock availability, and more consistent handling of routine tasks.

**Problems it solves:** teams spending hours on repetitive tasks; slow responses to customer enquiries; information spread across many tools; difficulty handling enquiries outside working hours.

**Who it is for:** businesses that want to automate routine work or offer instant answers to their customers.

**Typical work:** website chatbots and assistants, workflow automation, AI features added to existing websites or apps, and connecting AI to business tools.

**How to start:** share what task or process you want to improve. Our team reviews it and suggests a suitable approach and quote.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('1729c37a-9acc-4f9f-b3ab-b0267fc03315', 'a4aba0a9-1a77-47af-8dcb-53a59fcf2ce5', 'TriCore''s AI Services help businesses use artificial intelligence to save time and serve customers better. This includes AI chatbots and assistants for websites, automation of repetitive tasks, and connecting AI tools to the software a business already uses.

**Benefits:** less manual work, faster replies to customers, round-the-clock availability, and more consistent handling of routine tasks.

**Problems it solves:** teams spending hours on repetitive tasks; slow responses to customer enquiries; information spread across many tools; difficulty handling enquiries outside working hours.

**Who it is for:** businesses that want to automate routine work or offer instant answers to their customers.

**Typical work:** website chatbots and assistants, workflow automation, AI features added to existing websites or apps, and connecting AI to business tools.

**How to start:** share what task or process you want to improve. Our team reviews it and suggests a suitable approach and quote.', 'AI Services', 'AI, artificial intelligence, AI automation, automation, chatbot, AI chatbot, AI assistant, workflow automation, AI agent, machine learning, AI integration, GPT, LLM', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'a4aba0a9-1a77-47af-8dcb-53a59fcf2ce5');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('a12ecbcb-4ea9-49e8-9b6e-6eb4f90420db', 'service', 'Digital Marketing', 'digital marketing, online marketing, social media, social media marketing, ads, paid ads, advertising, Facebook ads, Instagram, Google Ads, PPC, campaigns, marketing strategy, brand awareness, leads', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('6fe2e286-73f2-4c27-b1de-7f238879467d', 'a12ecbcb-4ea9-49e8-9b6e-6eb4f90420db', 1, 'TriCore''s Digital Marketing service helps businesses reach the right audience online and turn interest into enquiries and sales.

**Benefits:** more visibility, more qualified enquiries, clearer understanding of what marketing works, and a consistent brand presence online.

**Problems it solves:** low online visibility; social media accounts that do not bring customers; advertising money spent without clear results; no clear marketing plan.

**Who it is for:** businesses that want more customers from online channels.

**Typical work:** marketing strategy, social media management, paid advertising campaigns, content planning, and performance reporting.

**How to start:** tell us about your business, your audience and your goals. Our team will suggest a plan and quote.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('c098c731-4aa1-4598-a2d9-0053825580a6', '6fe2e286-73f2-4c27-b1de-7f238879467d', 'TriCore''s Digital Marketing service helps businesses reach the right audience online and turn interest into enquiries and sales.

**Benefits:** more visibility, more qualified enquiries, clearer understanding of what marketing works, and a consistent brand presence online.

**Problems it solves:** low online visibility; social media accounts that do not bring customers; advertising money spent without clear results; no clear marketing plan.

**Who it is for:** businesses that want more customers from online channels.

**Typical work:** marketing strategy, social media management, paid advertising campaigns, content planning, and performance reporting.

**How to start:** tell us about your business, your audience and your goals. Our team will suggest a plan and quote.', 'Digital Marketing', 'digital marketing, online marketing, social media, social media marketing, ads, paid ads, advertising, Facebook ads, Instagram, Google Ads, PPC, campaigns, marketing strategy, brand awareness, leads', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '6fe2e286-73f2-4c27-b1de-7f238879467d');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('667a7763-3ab2-4328-b561-806825769bc1', 'service', 'Web Development', 'website, web development, web design, custom website, web app, web application, landing page, business website, e-commerce, online store, redesign, website development', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('7eb021c6-6e02-416d-8cf4-396c30f4239d', '667a7763-3ab2-4328-b561-806825769bc1', 1, 'TriCore''s Web Development service builds fast, secure and mobile-friendly websites and web applications, designed around each business''s needs.

**Benefits:** a professional online presence, a site that works well on phones and computers, room to grow, and features built for how your business works.

**Problems it solves:** an outdated or slow website; a site that does not work well on mobile; no website at all; needing custom features that ready-made tools cannot provide.

**Who it is for:** businesses that need a new website, a redesign, or a custom web application.

**Typical work:** business websites, landing pages, online stores, custom web applications, and website redesigns.

**How to start:** share what you need the website to do. Our team will review your requirements and prepare a quote.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('0153bc99-dd16-4df1-8c7e-bf4caa3dd332', '7eb021c6-6e02-416d-8cf4-396c30f4239d', 'TriCore''s Web Development service builds fast, secure and mobile-friendly websites and web applications, designed around each business''s needs.

**Benefits:** a professional online presence, a site that works well on phones and computers, room to grow, and features built for how your business works.

**Problems it solves:** an outdated or slow website; a site that does not work well on mobile; no website at all; needing custom features that ready-made tools cannot provide.

**Who it is for:** businesses that need a new website, a redesign, or a custom web application.

**Typical work:** business websites, landing pages, online stores, custom web applications, and website redesigns.

**How to start:** share what you need the website to do. Our team will review your requirements and prepare a quote.', 'Web Development', 'website, web development, web design, custom website, web app, web application, landing page, business website, e-commerce, online store, redesign, website development', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '7eb021c6-6e02-416d-8cf4-396c30f4239d');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('0a5912be-74d9-410a-8627-5eacda1da661', 'service', 'Graphic Designing', 'graphic design, graphic designing, design, logo, logo design, branding, brand identity, social media posts, banners, flyers, brochures, visual design, creatives, posters', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('307b2817-a1d7-45cc-ad20-a71d22e69c82', '0a5912be-74d9-410a-8627-5eacda1da661', 1, 'TriCore''s Graphic Designing service creates visuals that make a brand look professional and consistent across print and online channels.

**Benefits:** a recognisable brand, professional-looking materials, and visuals that support marketing and sales.

**Problems it solves:** no clear brand identity; inconsistent visuals across channels; marketing materials that look unprofessional; needing regular social media creatives.

**Who it is for:** businesses building or refreshing their brand, or needing ongoing design support.

**Typical work:** logos and brand identity, social media designs, banners and advertising creatives, brochures and flyers, and presentation designs.

**How to start:** tell us what you need designed and share any brand guidelines you already have. Our team will suggest an approach and quote.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('99458d1b-3d4b-4171-a390-a9606eac1211', '307b2817-a1d7-45cc-ad20-a71d22e69c82', 'TriCore''s Graphic Designing service creates visuals that make a brand look professional and consistent across print and online channels.

**Benefits:** a recognisable brand, professional-looking materials, and visuals that support marketing and sales.

**Problems it solves:** no clear brand identity; inconsistent visuals across channels; marketing materials that look unprofessional; needing regular social media creatives.

**Who it is for:** businesses building or refreshing their brand, or needing ongoing design support.

**Typical work:** logos and brand identity, social media designs, banners and advertising creatives, brochures and flyers, and presentation designs.

**How to start:** tell us what you need designed and share any brand guidelines you already have. Our team will suggest an approach and quote.', 'Graphic Designing', 'graphic design, graphic designing, design, logo, logo design, branding, brand identity, social media posts, banners, flyers, brochures, visual design, creatives, posters', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '307b2817-a1d7-45cc-ad20-a71d22e69c82');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('96fe5009-c593-4920-b13f-f8dcf824592c', 'service', 'SEO (Search Engine Optimization)', 'SEO, search engine optimization, Google ranking, rank on Google, search ranking, organic traffic, keywords, local SEO, technical SEO, on-page SEO, backlinks, visibility on Google', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('cc147890-47fc-4b70-b4f8-174a425d3d52', '96fe5009-c593-4920-b13f-f8dcf824592c', 1, 'TriCore''s SEO service helps a website become easier to find on search engines like Google, so more of the right people discover the business.

**Benefits:** more visitors from search engines, better visibility for the searches that matter to your business, and long-term growth that does not depend only on paid ads.

**Problems it solves:** a website that does not appear in search results; low organic traffic; competitors appearing above you; technical issues that hold a site back.

**Who it is for:** businesses that want more customers to find them through search engines.

**Typical work:** website SEO checks, keyword research, on-page improvements, technical SEO fixes, local SEO, and content guidance.

**How to start:** share your website address and goals. Our team will review it and suggest a plan and quote.

**Note:** search rankings depend on many factors outside anyone''s control, so no specific ranking can be promised.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('c488c4f7-4f9a-4ad3-a556-886546f9c645', 'cc147890-47fc-4b70-b4f8-174a425d3d52', 'TriCore''s SEO service helps a website become easier to find on search engines like Google, so more of the right people discover the business.

**Benefits:** more visitors from search engines, better visibility for the searches that matter to your business, and long-term growth that does not depend only on paid ads.

**Problems it solves:** a website that does not appear in search results; low organic traffic; competitors appearing above you; technical issues that hold a site back.

**Who it is for:** businesses that want more customers to find them through search engines.

**Typical work:** website SEO checks, keyword research, on-page improvements, technical SEO fixes, local SEO, and content guidance.

**How to start:** share your website address and goals. Our team will review it and suggest a plan and quote.

**Note:** search rankings depend on many factors outside anyone''s control, so no specific ranking can be promised.', 'SEO (Search Engine Optimization)', 'SEO, search engine optimization, Google ranking, rank on Google, search ranking, organic traffic, keywords, local SEO, technical SEO, on-page SEO, backlinks, visibility on Google', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'cc147890-47fc-4b70-b4f8-174a425d3d52');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('dd5233a6-359e-4c28-a27a-90026c2ec9e4', 'service', 'Video Editing', 'video, video editing, video editor, reels, shorts, YouTube videos, promotional video, social media videos, motion graphics, subtitles, captions, corporate video', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('710747e5-6578-4ae5-b5d7-100695f382c5', 'dd5233a6-359e-4c28-a27a-90026c2ec9e4', 1, 'TriCore''s Video Editing service turns raw footage into clear, engaging videos for social media, websites and marketing.

**Benefits:** professional-looking videos, content suited to each platform, and videos that hold attention and support your message.

**Problems it solves:** raw footage with no time to edit; videos that look unprofessional; needing regular short videos for social media; long videos that need to be cut into shorter clips.

**Who it is for:** businesses, creators and marketers who need edited video content.

**Typical work:** social media reels and shorts, YouTube videos, promotional and corporate videos, subtitles and captions, and simple motion graphics.

**How to start:** tell us what kind of videos you need and how often. Our team will suggest an approach and quote.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('2bebd5b3-1008-45aa-a834-6ea1cdafc487', '710747e5-6578-4ae5-b5d7-100695f382c5', 'TriCore''s Video Editing service turns raw footage into clear, engaging videos for social media, websites and marketing.

**Benefits:** professional-looking videos, content suited to each platform, and videos that hold attention and support your message.

**Problems it solves:** raw footage with no time to edit; videos that look unprofessional; needing regular short videos for social media; long videos that need to be cut into shorter clips.

**Who it is for:** businesses, creators and marketers who need edited video content.

**Typical work:** social media reels and shorts, YouTube videos, promotional and corporate videos, subtitles and captions, and simple motion graphics.

**How to start:** tell us what kind of videos you need and how often. Our team will suggest an approach and quote.', 'Video Editing', 'video, video editing, video editor, reels, shorts, YouTube videos, promotional video, social media videos, motion graphics, subtitles, captions, corporate video', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '710747e5-6578-4ae5-b5d7-100695f382c5');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('ccf86e12-4cf7-413f-a417-8d102e44ae48', 'service', 'Mobile App Development', 'mobile app, app development, app, Android app, iOS app, iPhone app, cross-platform app, Flutter, React Native, mobile application, build an app', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('245f3339-7427-4d5b-9028-e6ccb362b7ba', 'ccf86e12-4cf7-413f-a417-8d102e44ae48', 1, 'TriCore''s Mobile App Development service builds mobile applications for Android and iPhone that are easy to use and built around the customer''s needs.

**Benefits:** a direct channel to your customers, a better experience for mobile users, and features designed for your business.

**Problems it solves:** customers expecting an app; processes that would work better on a phone; an existing app that is outdated or hard to use.

**Who it is for:** businesses and startups that want an app for their customers or their team.

**Typical work:** Android and iPhone apps, cross-platform apps, and apps that connect to a website or business system.

**How to start:** describe your app idea and its main features. Our team will review it and prepare a quote.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('0c4ef444-fcad-4136-9634-032c1c757f74', '245f3339-7427-4d5b-9028-e6ccb362b7ba', 'TriCore''s Mobile App Development service builds mobile applications for Android and iPhone that are easy to use and built around the customer''s needs.

**Benefits:** a direct channel to your customers, a better experience for mobile users, and features designed for your business.

**Problems it solves:** customers expecting an app; processes that would work better on a phone; an existing app that is outdated or hard to use.

**Who it is for:** businesses and startups that want an app for their customers or their team.

**Typical work:** Android and iPhone apps, cross-platform apps, and apps that connect to a website or business system.

**How to start:** describe your app idea and its main features. Our team will review it and prepare a quote.', 'Mobile App Development', 'mobile app, app development, app, Android app, iOS app, iPhone app, cross-platform app, Flutter, React Native, mobile application, build an app', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '245f3339-7427-4d5b-9028-e6ccb362b7ba');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('3a79fd45-70e5-48f3-8dd0-1ef3d20e4b3e', 'service', 'WordPress Development', 'WordPress, WordPress website, WordPress development, WooCommerce, WordPress theme, WordPress plugin, Elementor, CMS, WordPress site, WordPress fix, WordPress speed', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('0ad3fc74-19cd-477f-93dd-9a4996b5034b', '3a79fd45-70e5-48f3-8dd0-1ef3d20e4b3e', 1, 'TriCore''s WordPress Development service builds and improves WordPress websites that are easy for business owners to update themselves.

**Benefits:** a professional site you can manage without coding, a large choice of features through plugins, and online selling with WooCommerce.

**Problems it solves:** needing a website you can update yourself; a slow or broken WordPress site; wanting to sell online with WordPress; an outdated theme or design.

**Who it is for:** businesses that want a flexible, easy-to-manage website.

**Typical work:** new WordPress websites, WooCommerce stores, theme customisation, plugin setup, speed improvements, and fixes to existing WordPress sites.

**How to start:** tell us what you need your WordPress site to do. Our team will review it and prepare a quote.

---

# Part 2 â€” Combinations', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('85c296d1-6e23-4dab-91f0-4a6347cf2a6b', '0ad3fc74-19cd-477f-93dd-9a4996b5034b', 'TriCore''s WordPress Development service builds and improves WordPress websites that are easy for business owners to update themselves.

**Benefits:** a professional site you can manage without coding, a large choice of features through plugins, and online selling with WooCommerce.

**Problems it solves:** needing a website you can update yourself; a slow or broken WordPress site; wanting to sell online with WordPress; an outdated theme or design.

**Who it is for:** businesses that want a flexible, easy-to-manage website.

**Typical work:** new WordPress websites, WooCommerce stores, theme customisation, plugin setup, speed improvements, and fixes to existing WordPress sites.

**How to start:** tell us what you need your WordPress site to do. Our team will review it and prepare a quote.

---

# Part 2 â€” Combinations', 'WordPress Development', 'WordPress, WordPress website, WordPress development, WooCommerce, WordPress theme, WordPress plugin, Elementor, CMS, WordPress site, WordPress fix, WordPress speed', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '0ad3fc74-19cd-477f-93dd-9a4996b5034b');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('5613fb81-a3e7-48f0-95b6-1fda7a00fea9', 'combination', 'Website and SEO', 'new website and SEO, website that ranks, get found online', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('88105933-1d4b-4b74-8c39-ba0818cede1c', '5613fb81-a3e7-48f0-95b6-1fda7a00fea9', 1, 'Fits when a visitor needs a new or redesigned website and also wants it to be found on Google. Web Development builds the site; SEO helps it appear in search results.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('0343aae9-bcc9-4965-b06c-053091d35987', '88105933-1d4b-4b74-8c39-ba0818cede1c', 'Fits when a visitor needs a new or redesigned website and also wants it to be found on Google. Web Development builds the site; SEO helps it appear in search results.', 'Website and SEO', 'new website and SEO, website that ranks, get found online', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '88105933-1d4b-4b74-8c39-ba0818cede1c');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('5d4991e6-22b1-452e-a7d5-8d70ab839e0a', 'combination', 'WordPress website and SEO', 'WordPress SEO, WordPress site that ranks', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('1be13b36-0940-4bae-b14a-b559a17741a6', '5d4991e6-22b1-452e-a7d5-8d70ab839e0a', 1, 'Fits when a visitor wants an easy-to-manage WordPress site that is also found on search engines.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('200c8217-c69a-406e-8ccb-04703f000936', '1be13b36-0940-4bae-b14a-b559a17741a6', 'Fits when a visitor wants an easy-to-manage WordPress site that is also found on search engines.', 'WordPress website and SEO', 'WordPress SEO, WordPress site that ranks', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '1be13b36-0940-4bae-b14a-b559a17741a6');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('e90d6bda-72c9-4c5a-814d-951ed952468a', 'combination', 'AI and website', 'website chatbot, website with AI, AI assistant on website, automate website enquiries', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('3f2a842e-006c-4760-9ea6-a49709479d71', 'e90d6bda-72c9-4c5a-814d-951ed952468a', 1, 'Fits when a visitor wants a website with AI features, such as a chatbot that answers questions, or automation connected to the site.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('23af3c37-7dd7-4da6-b271-6c91da9bc165', '3f2a842e-006c-4760-9ea6-a49709479d71', 'Fits when a visitor wants a website with AI features, such as a chatbot that answers questions, or automation connected to the site.', 'AI and website', 'website chatbot, website with AI, AI assistant on website, automate website enquiries', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '3f2a842e-006c-4760-9ea6-a49709479d71');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('25baf1fc-b8e3-406f-bf50-6b8ca30a5287', 'combination', 'SEO and Digital Marketing', 'more customers online, grow online, more leads, online growth', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('d84e7c94-ff5b-4d9e-a0f7-4d36bee79702', '25baf1fc-b8e3-406f-bf50-6b8ca30a5287', 1, 'Fits when a visitor''s main goal is more customers from online channels. SEO brings visitors from search over time; Digital Marketing brings visitors through social media and ads.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('fe0d7373-f6e8-4673-a7a3-bb93bec735fb', 'd84e7c94-ff5b-4d9e-a0f7-4d36bee79702', 'Fits when a visitor''s main goal is more customers from online channels. SEO brings visitors from search over time; Digital Marketing brings visitors through social media and ads.', 'SEO and Digital Marketing', 'more customers online, grow online, more leads, online growth', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'd84e7c94-ff5b-4d9e-a0f7-4d36bee79702');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('d21e01e8-17ee-4818-a601-f21e160371ad', 'combination', 'Video and Digital Marketing', 'video ads, social media videos for marketing, reels for marketing', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('b5d9bfa3-2ce1-42dd-a0b3-607a7b51b68e', 'd21e01e8-17ee-4818-a601-f21e160371ad', 1, 'Fits when a visitor wants video content to use in social media or advertising campaigns.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('91395b8b-78dc-41d6-b0f7-926a393951fe', 'b5d9bfa3-2ce1-42dd-a0b3-607a7b51b68e', 'Fits when a visitor wants video content to use in social media or advertising campaigns.', 'Video and Digital Marketing', 'video ads, social media videos for marketing, reels for marketing', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'b5d9bfa3-2ce1-42dd-a0b3-607a7b51b68e');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('4b457ac8-99a8-44ad-a9c8-04b73e334a58', 'combination', 'Graphic Design and Digital Marketing', 'branding and marketing, social media designs and ads, creatives for campaigns', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('763e742c-01f7-455a-88e9-7d958046fe58', '4b457ac8-99a8-44ad-a9c8-04b73e334a58', 1, 'Fits when a visitor needs designs and creatives for marketing campaigns or social media. (Proposed combination, to be confirmed.)', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('b613d081-90b9-4ccf-a18d-1b42c3d9db60', '763e742c-01f7-455a-88e9-7d958046fe58', 'Fits when a visitor needs designs and creatives for marketing campaigns or social media. (Proposed combination, to be confirmed.)', 'Graphic Design and Digital Marketing', 'branding and marketing, social media designs and ads, creatives for campaigns', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '763e742c-01f7-455a-88e9-7d958046fe58');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('0e2f93f3-ef0c-420e-91fc-6d659931409e', 'combination', 'Mobile App and Web Development', 'app and website, app with web dashboard, app and admin panel', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('5387bc70-fa96-4957-ba8c-9c2f594e70b5', '0e2f93f3-ef0c-420e-91fc-6d659931409e', 1, 'Fits when a visitor needs both a mobile app and a website or web dashboard that work together. (Proposed combination, to be confirmed.)

---

# Part 3 â€” Company information', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('06ec1d21-45ec-4260-9da5-e248ba3bf70c', '5387bc70-fa96-4957-ba8c-9c2f594e70b5', 'Fits when a visitor needs both a mobile app and a website or web dashboard that work together. (Proposed combination, to be confirmed.)

---

# Part 3 â€” Company information', 'Mobile App and Web Development', 'app and website, app with web dashboard, app and admin panel', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '5387bc70-fa96-4957-ba8c-9c2f594e70b5');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('3b044405-47d7-4ac8-bb7e-feae21155b80', 'company', 'About TriCore Digital Tech', 'about, who are you, about TriCore, company, what is TriCore', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('abeb81f9-a79a-43d4-b2b1-cc456d9e5a33', '3b044405-47d7-4ac8-bb7e-feae21155b80', 1, 'TriCore Digital Tech is a digital agency that helps businesses grow online. We offer AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development and WordPress Development.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('db42becc-63f1-4af1-a00f-90316868f465', 'abeb81f9-a79a-43d4-b2b1-cc456d9e5a33', 'TriCore Digital Tech is a digital agency that helps businesses grow online. We offer AI Services, Digital Marketing, Web Development, Graphic Designing, SEO, Video Editing, Mobile App Development and WordPress Development.', 'About TriCore Digital Tech', 'about, who are you, about TriCore, company, what is TriCore', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'abeb81f9-a79a-43d4-b2b1-cc456d9e5a33');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('58d5e370-6c62-48eb-ab49-70ee8598afd7', 'company', 'Location', 'location, where are you, address, office, based, Pakistan, Rawalpindi', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('e7e31d13-0f9b-446e-bdfa-eb48c4ea16b6', '58d5e370-6c62-48eb-ab49-70ee8598afd7', 1, 'TriCore Digital Tech is based in Rawalpindi, Pakistan, and works with clients in Pakistan and internationally, including the UK, Australia and Canada. *(Full office address: to be added by TriCore.)*', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('41e615f6-0ba1-4110-8719-f32a5c638f07', 'e7e31d13-0f9b-446e-bdfa-eb48c4ea16b6', 'TriCore Digital Tech is based in Rawalpindi, Pakistan, and works with clients in Pakistan and internationally, including the UK, Australia and Canada. *(Full office address: to be added by TriCore.)*', 'Location', 'location, where are you, address, office, based, Pakistan, Rawalpindi', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'e7e31d13-0f9b-446e-bdfa-eb48c4ea16b6');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('6f9d7863-ee64-4b54-9b97-95170fccecb3', 'company', 'Contact details', 'contact, email, phone, reach you, get in touch, contact details', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('def218b7-4c90-4b74-9483-0c6d04ffeb74', '6f9d7863-ee64-4b54-9b97-95170fccecb3', 1, 'You can email us at Info@tricoredigitaltech.com, or leave your details here in the chat and our team will contact you. *(Phone number: to be added by TriCore if it should be shared.)*', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('29463887-c620-434f-9d5e-215d44f17efc', 'def218b7-4c90-4b74-9483-0c6d04ffeb74', 'You can email us at Info@tricoredigitaltech.com, or leave your details here in the chat and our team will contact you. *(Phone number: to be added by TriCore if it should be shared.)*', 'Contact details', 'contact, email, phone, reach you, get in touch, contact details', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'def218b7-4c90-4b74-9483-0c6d04ffeb74');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('78bef2a6-0b4f-4015-b313-1b2626ab36ef', 'company', 'Working hours', 'working hours, office hours, opening hours, when are you open, timing, available', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('2146bf32-9054-4b68-9664-779b2e696b2d', '78bef2a6-0b4f-4015-b313-1b2626ab36ef', 1, 'Our team is available 9:00 AM to 7:00 PM Pakistan Standard Time (PKT), Monday to Friday. This assistant is available 24/7, and you can leave your details any time for a callback.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('9e0e2050-8ef0-4f3d-9ffb-68f8f1c46533', '2146bf32-9054-4b68-9664-779b2e696b2d', 'Our team is available 9:00 AM to 7:00 PM Pakistan Standard Time (PKT), Monday to Friday. This assistant is available 24/7, and you can leave your details any time for a callback.', 'Working hours', 'working hours, office hours, opening hours, when are you open, timing, available', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '2146bf32-9054-4b68-9664-779b2e696b2d');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('6dc73778-d489-4f97-a559-732d563964f4', 'company', 'How we work', 'process, how do you work, steps, how does it work, project process, what happens next', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('5b9985da-daca-4736-bf9e-c4a38f828c7e', '6dc73778-d489-4f97-a559-732d563964f4', 1, 'Our usual process: (1) you share your requirements; (2) our team discusses them with you and asks any questions; (3) we send a proposal and quote; (4) once agreed, we start the work and keep you updated; (5) you review the work; (6) we deliver and offer support afterwards. The exact steps depend on the project.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('94e39cbe-7de0-4152-a7ee-1056544cbbe4', '5b9985da-daca-4736-bf9e-c4a38f828c7e', 'Our usual process: (1) you share your requirements; (2) our team discusses them with you and asks any questions; (3) we send a proposal and quote; (4) once agreed, we start the work and keep you updated; (5) you review the work; (6) we deliver and offer support afterwards. The exact steps depend on the project.', 'How we work', 'process, how do you work, steps, how does it work, project process, what happens next', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '5b9985da-daca-4736-bf9e-c4a38f828c7e');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('deaefcbe-7fbf-4ad7-bddb-1edb4153f87a', 'company', 'Where we work', 'countries, international, do you work with UK clients, overseas, abroad, remote', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('28b1301c-688e-4b5b-9d4f-e9a90f58e5fa', 'deaefcbe-7fbf-4ad7-bddb-1edb4153f87a', 1, 'We work with clients in Pakistan and internationally, including the UK, Australia, Canada and other countries. Projects are handled remotely.

---

# Part 4 â€” FAQs', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('a1654547-7e33-4d10-a2f7-77517fb28703', '28b1301c-688e-4b5b-9d4f-e9a90f58e5fa', 'We work with clients in Pakistan and internationally, including the UK, Australia, Canada and other countries. Projects are handled remotely.

---

# Part 4 â€” FAQs', 'Where we work', 'countries, international, do you work with UK clients, overseas, abroad, remote', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '28b1301c-688e-4b5b-9d4f-e9a90f58e5fa');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('0864a559-a438-43cf-a2d7-d40d9156439c', 'faq', 'How much does a project cost?', 'price, cost, pricing, how much, rates, charges, fee, quote, budget', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('5ae8a685-2c8e-4ca7-93ae-21bbe8e482ab', '0864a559-a438-43cf-a2d7-d40d9156439c', 1, 'Every project is different, so pricing depends on what you need. Our sales team prepares a quote after understanding your requirements. I can collect your details so they can contact you.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('00f12b2a-c53f-4893-915d-0740c85d6500', '5ae8a685-2c8e-4ca7-93ae-21bbe8e482ab', 'Every project is different, so pricing depends on what you need. Our sales team prepares a quote after understanding your requirements. I can collect your details so they can contact you.', 'How much does a project cost?', 'price, cost, pricing, how much, rates, charges, fee, quote, budget', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '5ae8a685-2c8e-4ca7-93ae-21bbe8e482ab');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('d5e80db5-5710-4e03-be4b-c93e47e1ca4d', 'faq', 'How long does a project take?', 'timeline, how long, duration, delivery time, turnaround, deadline, when will it be ready', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('1120da65-f90f-4c4c-a613-04df6ad2d367', 'd5e80db5-5710-4e03-be4b-c93e47e1ca4d', 1, 'The time depends on the size and features of the project. Our team gives you an expected timeline with the proposal, after reviewing your requirements.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('59dc8439-5164-4641-a3cf-f1b361828063', '1120da65-f90f-4c4c-a613-04df6ad2d367', 'The time depends on the size and features of the project. Our team gives you an expected timeline with the proposal, after reviewing your requirements.', 'How long does a project take?', 'timeline, how long, duration, delivery time, turnaround, deadline, when will it be ready', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '1120da65-f90f-4c4c-a613-04df6ad2d367');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('8794b441-913e-4793-aad9-ea7450f55f73', 'faq', 'Do you offer packages?', 'packages, plans, bundles, fixed package, combo', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('1a196fd2-1737-4b06-8b0b-fce3ed57a4ac', '8794b441-913e-4793-aad9-ea7450f55f73', 1, 'We shape a package around each client''s requirements and budget, often combining services such as a website with SEO. Our sales team confirms the details and price.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('7915c158-aa4d-4199-b6a2-a2ed960c934c', '1a196fd2-1737-4b06-8b0b-fce3ed57a4ac', 'We shape a package around each client''s requirements and budget, often combining services such as a website with SEO. Our sales team confirms the details and price.', 'Do you offer packages?', 'packages, plans, bundles, fixed package, combo', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '1a196fd2-1737-4b06-8b0b-fce3ed57a4ac');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('85e281a0-f0ce-49c8-abd7-89e30bd7d0f7', 'faq', 'Can I get a free quote?', 'free quote, estimate, proposal, quotation', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('e7938ed9-e201-4b8d-b356-2e5eeb296bf3', '85e281a0-f0ce-49c8-abd7-89e30bd7d0f7', 1, 'Yes. Share your requirements here or by email, and our sales team will review them and contact you with a quote.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('9c127b85-1fee-44a7-9c1b-888d53598797', 'e7938ed9-e201-4b8d-b356-2e5eeb296bf3', 'Yes. Share your requirements here or by email, and our sales team will review them and contact you with a quote.', 'Can I get a free quote?', 'free quote, estimate, proposal, quotation', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'e7938ed9-e201-4b8d-b356-2e5eeb296bf3');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('3e80c593-2ae4-4a09-ad2e-c5150b2c95b2', 'faq', 'Do you work with small businesses and startups?', 'small business, startup, new business, small company, individual', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('9d1b81a2-c548-47e2-a71c-a67e6d43114b', '3e80c593-2ae4-4a09-ad2e-c5150b2c95b2', 1, 'Yes. We work with businesses of different sizes, including small businesses and startups.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('ada9dd8b-333f-4569-8a15-511de93e3d76', '9d1b81a2-c548-47e2-a71c-a67e6d43114b', 'Yes. We work with businesses of different sizes, including small businesses and startups.', 'Do you work with small businesses and startups?', 'small business, startup, new business, small company, individual', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '9d1b81a2-c548-47e2-a71c-a67e6d43114b');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('e7c5f483-07c3-4720-b495-08a1d5963919', 'faq', 'Do you provide support after the project?', 'support, maintenance, after launch, updates, help after delivery', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('89974b62-c6f9-4d72-bb3e-51814a8a58dd', 'e7c5f483-07c3-4720-b495-08a1d5963919', 1, 'Yes, we offer support after delivery. The type and length of support are agreed with you in the proposal.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('a364e324-ef4b-40ad-9e35-cb37d0c1e880', '89974b62-c6f9-4d72-bb3e-51814a8a58dd', 'Yes, we offer support after delivery. The type and length of support are agreed with you in the proposal.', 'Do you provide support after the project?', 'support, maintenance, after launch, updates, help after delivery', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '89974b62-c6f9-4d72-bb3e-51814a8a58dd');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('602d212c-3f33-4512-bf65-5a7799daec4c', 'faq', 'Can you improve my existing website?', 'redesign, improve website, fix website, update website, existing site', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('aa0118cc-0f44-4175-98d9-a30bb117f429', '602d212c-3f33-4512-bf65-5a7799daec4c', 1, 'Yes. We can redesign, update or fix existing websites, including WordPress sites. Share your website address and what you want to change.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('d714ec37-dd13-40e0-8866-1240c4c0ec06', 'aa0118cc-0f44-4175-98d9-a30bb117f429', 'Yes. We can redesign, update or fix existing websites, including WordPress sites. Share your website address and what you want to change.', 'Can you improve my existing website?', 'redesign, improve website, fix website, update website, existing site', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'aa0118cc-0f44-4175-98d9-a30bb117f429');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('ad9ba417-9a4f-4a26-8317-9680bc34c1e2', 'faq', 'Will my website work on mobile phones?', 'mobile friendly, responsive, works on phone, mobile version', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('0a428d00-664e-4094-9d23-c5a644da9e9b', 'ad9ba417-9a4f-4a26-8317-9680bc34c1e2', 1, 'Yes. The websites we build are designed to work well on phones, tablets and computers.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('7cc98ba3-4d10-4638-8a11-40339d7d5152', '0a428d00-664e-4094-9d23-c5a644da9e9b', 'Yes. The websites we build are designed to work well on phones, tablets and computers.', 'Will my website work on mobile phones?', 'mobile friendly, responsive, works on phone, mobile version', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '0a428d00-664e-4094-9d23-c5a644da9e9b');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('47b2db0c-e635-4338-a94f-f35a204ecd41', 'faq', 'Can I update my website myself?', 'update myself, edit website, manage content, CMS, no coding', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('7c395665-e7f9-4a3d-8fc9-8d3da70a8732', '47b2db0c-e635-4338-a94f-f35a204ecd41', 1, 'Yes, if the website is built on WordPress or another content management system. We can show you how to update text, images and pages.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('595c630b-7ba4-4c89-b35f-249237a9c3f3', '7c395665-e7f9-4a3d-8fc9-8d3da70a8732', 'Yes, if the website is built on WordPress or another content management system. We can show you how to update text, images and pages.', 'Can I update my website myself?', 'update myself, edit website, manage content, CMS, no coding', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '7c395665-e7f9-4a3d-8fc9-8d3da70a8732');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('ece7aa76-4dca-4cff-a4f6-9d953acc7cc8', 'faq', 'Can you guarantee first place on Google?', 'guarantee ranking, first page Google, number one Google, rank first', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('9929be46-150f-42ea-995a-0a66502f25d8', 'ece7aa76-4dca-4cff-a4f6-9d953acc7cc8', 1, 'No one can honestly guarantee a specific ranking, because search engines decide rankings using many factors. Our SEO work aims to improve your visibility over time.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('42189ec1-076c-4faf-ba04-7b06108c1aa5', '9929be46-150f-42ea-995a-0a66502f25d8', 'No one can honestly guarantee a specific ranking, because search engines decide rankings using many factors. Our SEO work aims to improve your visibility over time.', 'Can you guarantee first place on Google?', 'guarantee ranking, first page Google, number one Google, rank first', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '9929be46-150f-42ea-995a-0a66502f25d8');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('806bb871-a112-4b6d-a405-937077cc5b05', 'faq', 'Do you build chatbots like this one?', 'chatbot like this, build a chatbot, AI assistant for my website, can you make a bot', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('e790e88a-09e5-4100-8c84-74f3bc31fb7c', '806bb871-a112-4b6d-a405-937077cc5b05', 1, 'Yes. Chatbots and AI assistants are part of our AI Services. Tell us what you want your assistant to do and our team will suggest an approach.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('106609b5-a305-49a4-8bdc-c66b88ed316c', 'e790e88a-09e5-4100-8c84-74f3bc31fb7c', 'Yes. Chatbots and AI assistants are part of our AI Services. Tell us what you want your assistant to do and our team will suggest an approach.', 'Do you build chatbots like this one?', 'chatbot like this, build a chatbot, AI assistant for my website, can you make a bot', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'e790e88a-09e5-4100-8c84-74f3bc31fb7c');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('231fb036-9f7f-48f6-a21c-94a60a079c83', 'faq', 'Do you make apps for both Android and iPhone?', 'Android and iOS, both platforms, iPhone and Android', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('f7526bc8-bcf1-4e47-ade2-f0aa73ecd628', '231fb036-9f7f-48f6-a21c-94a60a079c83', 1, 'Yes. We build apps for Android and iPhone, including cross-platform apps that work on both.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('2fc2b829-ae9c-4148-bf80-ec2d6f571af1', 'f7526bc8-bcf1-4e47-ade2-f0aa73ecd628', 'Yes. We build apps for Android and iPhone, including cross-platform apps that work on both.', 'Do you make apps for both Android and iPhone?', 'Android and iOS, both platforms, iPhone and Android', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'f7526bc8-bcf1-4e47-ade2-f0aa73ecd628');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('080c88d7-13bb-4405-80d0-f3a772dc96cf', 'faq', 'Do you manage social media accounts?', 'social media management, manage Instagram, manage Facebook, posting', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('3677cba5-d323-450e-a9e6-5be01b022830', '080c88d7-13bb-4405-80d0-f3a772dc96cf', 1, 'Yes. Social media management is part of our Digital Marketing service, including planning and publishing content.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('4525a068-ceed-4909-b16b-8b7cb921f9c9', '3677cba5-d323-450e-a9e6-5be01b022830', 'Yes. Social media management is part of our Digital Marketing service, including planning and publishing content.', 'Do you manage social media accounts?', 'social media management, manage Instagram, manage Facebook, posting', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '3677cba5-d323-450e-a9e6-5be01b022830');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('10ecb79d-4261-4d65-9f18-8fcba19d6fd4', 'faq', 'Can you design my logo?', 'logo, logo design, new logo, brand logo', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('f64d7a1e-5057-4084-9bc0-f874f7b83eb1', '10ecb79d-4261-4d65-9f18-8fcba19d6fd4', 1, 'Yes. Logo and brand identity design is part of our Graphic Designing service.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('ad6165e9-2595-4f3e-a7c1-0b0d7a5b45f0', 'f64d7a1e-5057-4084-9bc0-f874f7b83eb1', 'Yes. Logo and brand identity design is part of our Graphic Designing service.', 'Can you design my logo?', 'logo, logo design, new logo, brand logo', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'f64d7a1e-5057-4084-9bc0-f874f7b83eb1');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('bb13164c-694f-449f-92f2-4d6c726aea67', 'faq', 'Do you edit YouTube videos and reels?', 'YouTube editing, reels, shorts, TikTok videos', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('4fcfe4b6-7906-430a-bbfa-2eadfbcce3e9', 'bb13164c-694f-449f-92f2-4d6c726aea67', 1, 'Yes. We edit YouTube videos, reels, shorts and other social media videos.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('9f5ed912-1d05-457d-9eb9-5721cde181e0', '4fcfe4b6-7906-430a-bbfa-2eadfbcce3e9', 'Yes. We edit YouTube videos, reels, shorts and other social media videos.', 'Do you edit YouTube videos and reels?', 'YouTube editing, reels, shorts, TikTok videos', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '4fcfe4b6-7906-430a-bbfa-2eadfbcce3e9');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('c5ee0a40-4d10-485e-9e0a-5b3fc045f33d', 'faq', 'How do I share my files or footage?', 'send files, share footage, upload, attach, documents', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('877ebea5-25f0-4f49-ab81-e8331124c8a7', 'c5ee0a40-4d10-485e-9e0a-5b3fc045f33d', 1, 'This chat does not accept file uploads. After you share your details, our team will contact you and arrange the best way to send files.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('e6006a5b-afae-4332-a031-f96c57d6a732', '877ebea5-25f0-4f49-ab81-e8331124c8a7', 'This chat does not accept file uploads. After you share your details, our team will contact you and arrange the best way to send files.', 'How do I share my files or footage?', 'send files, share footage, upload, attach, documents', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '877ebea5-25f0-4f49-ab81-e8331124c8a7');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('bd5e8f91-8151-4b4e-9867-1a4efb074fe3', 'faq', 'What happens after I share my details?', 'next steps, what happens next, after I submit, when will you contact me', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('b566aac6-4e59-45c7-b497-cc39f85f3500', 'bd5e8f91-8151-4b4e-9867-1a4efb074fe3', 1, 'Our sales team receives your details right away. During working hours (9:00 AM to 7:00 PM PKT, Monday to Friday) they aim to respond quickly; outside those hours they contact you on the next working day.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('ede61270-2547-490f-bffa-58e8ce2b8885', 'b566aac6-4e59-45c7-b497-cc39f85f3500', 'Our sales team receives your details right away. During working hours (9:00 AM to 7:00 PM PKT, Monday to Friday) they aim to respond quickly; outside those hours they contact you on the next working day.', 'What happens after I share my details?', 'next steps, what happens next, after I submit, when will you contact me', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'b566aac6-4e59-45c7-b497-cc39f85f3500');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('74aad5ad-c873-48c4-8f36-4ac2b03082df', 'faq', 'Is my information safe?', 'privacy, data, personal information, safe, secure, GDPR', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('bedd4edf-eae0-46c7-9226-0997b50cad7d', '74aad5ad-c873-48c4-8f36-4ac2b03082df', 1, 'We only collect the details you agree to share, use them to respond to your enquiry, and keep them for a limited time. See our privacy policy for details. *(Link to be added.)*', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('4a73e593-3abd-4993-a9d8-14d67679f190', 'bedd4edf-eae0-46c7-9226-0997b50cad7d', 'We only collect the details you agree to share, use them to respond to your enquiry, and keep them for a limited time. See our privacy policy for details. *(Link to be added.)*', 'Is my information safe?', 'privacy, data, personal information, safe, secure, GDPR', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', 'bedd4edf-eae0-46c7-9226-0997b50cad7d');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('a2a02778-1e36-4675-842b-8624b11b2d2f', 'faq', 'Can I talk to a real person?', 'human, real person, agent, staff, talk to someone, representative', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('76ff9dda-defb-4ce6-90e3-c93795e1871a', 'a2a02778-1e36-4675-842b-8624b11b2d2f', 1, 'Yes. During working hours I can connect you with our team. Outside working hours, you can leave your details and we will call you back.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('0f418762-9cd2-4899-baf4-873a274f4d1a', '76ff9dda-defb-4ce6-90e3-c93795e1871a', 'Yes. During working hours I can connect you with our team. Outside working hours, you can leave your details and we will call you back.', 'Can I talk to a real person?', 'human, real person, agent, staff, talk to someone, representative', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '76ff9dda-defb-4ce6-90e3-c93795e1871a');
INSERT OR IGNORE INTO knowledge_entry (id, entry_type, title, keywords, status) VALUES ('aa58e0b5-7f53-4719-8a21-bc1e95c4efa9', 'faq', 'Are you hiring?', 'jobs, careers, hiring, vacancy, internship, apply', 'approved');
INSERT OR IGNORE INTO knowledge_entry_version (id, entry_id, version_no, body, status, author_id, approver_id, approved_at, is_live) VALUES ('25e081fc-1d1c-4e9a-83cf-5d67eedcd3bd', 'aa58e0b5-7f53-4719-8a21-bc1e95c4efa9', 1, 'This assistant handles service enquiries only. For job applications, please email Info@tricoredigitaltech.com.', 'approved', '645ee146-1ffc-4832-a412-cea7c06e43e2', '645ee146-1ffc-4832-a412-cea7c06e43e2', 1794725870622, 1);
INSERT OR IGNORE INTO knowledge_chunk (id, entry_version_id, chunk_text, title, keywords, chunk_seq) VALUES ('fdd62a53-5bd7-4b2c-a576-f181c9921a7c', '25e081fc-1d1c-4e9a-83cf-5d67eedcd3bd', 'This assistant handles service enquiries only. For job applications, please email Info@tricoredigitaltech.com.', 'Are you hiring?', 'jobs, careers, hiring, vacancy, internship, apply', 0);
INSERT OR IGNORE INTO release_item (release_id, entry_version_id) VALUES ('8a9bb867-6dbb-4f64-83a9-392815499d72', '25e081fc-1d1c-4e9a-83cf-5d67eedcd3bd');

