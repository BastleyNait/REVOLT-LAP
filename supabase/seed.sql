-- ============================================================================
-- REVOLT — seed data (mirrors src/lib/data/fallback-products.ts)
-- Safe to re-run: conflicts on slug are ignored.
-- ============================================================================

insert into public.products
  (slug, name, brand, price, original_price, currency, condition_grade,
   processor, ram, storage, display, battery_health, description, verdict,
   specs, images, badges, stock, is_active, is_featured)
values
  (
    'thinkpad-t480', 'ThinkPad T480', 'Lenovo', 299, 389, 'USD', 'GRADE A',
    'Intel Core i5 8th Gen', '16GB RAM', '512GB SSD', '14" FHD IPS', '> 85% CAPACITY',
    'The indestructible workhorse. Refurbished to a pristine state, ready for a full day of work without compromise.',
    'If you need a machine that simply refuses to die, this is it. Built like a tank, priced like a steal.',
    '[{"label":"PORTS","value":"USB-C, HDMI, RJ45"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuAFejqBTHyDYdAVe6IEpTfL8i4WGgfSTrD5QDKLMcc_HA5VubNvDxg9_1iBFpYY_alOVs9R8qJMhIQ_-PDqNei9Yh6NtS0eFrpiJ_oCoQapz9MLPHVevmE_CuzMNKa482CGYT5w1pqtQvBcel_dKS9Exrnajc_rkL0UwAXSwYOGGT_ZbF0B8QDEdhd1_jL78oHMY3Q4qErlkpugWKXvk8BifBDNVbq2quvzLkH8i-l4SkO9yg1qBXbU285BlXHaA_eCnnnWoHQXanc"]'::jsonb,
    '["BEST SELLER"]'::jsonb,
    7, true, true
  ),
  (
    'macbook-air-m1', 'MacBook Air M1', 'Apple', 650, null, 'USD', 'GRADE A MINT',
    'Apple Silicon (2020)', '8GB RAM', '256GB SSD', '13.3" Retina', '> 90% CAPACITY',
    'Silent, fanless and absurdly efficient. Apple Silicon performance at a fraction of the retail price.',
    'Still the best value laptop Apple ever shipped. Cool, quiet, and fast.',
    '[{"label":"GPU","value":"7-Core GPU"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuBlRzYH8L-udqDBH261pTgfKqCbC0YcfMzWcW7uSpq3hq96w2USyimYF2JuMwH6kynF8mkw8gUZVkIt1u6FgRkDVphCUyNzewmhB-XboO0eQgyMj9y_GOXufZ_HkZiiEmjU8mX6FeoQ6tzk4-5ZOX4CJd54r4Cj1EvmVqjcFfvYvDtgoePe9TX4yQT6bEV-3SxC228PmQwGAJY7nYkepaItQuRl4CrjetJghkn8Lgp_BDDSYt_07Tc2Ktzq5ALMbMNTOhCwc_5LRjg"]'::jsonb,
    '["SILENT","FANLESS"]'::jsonb,
    3, true, false
  ),
  (
    'dell-xps-15', 'Dell XPS 15', 'Dell', 899, null, 'USD', 'GRADE A',
    'Intel Core i7 11th Gen', '32GB RAM', '1TB NVMe', '15.6" 4K OLED', '> 88% CAPACITY',
    'A creator''s powerhouse. Stunning 4K OLED panel paired with serious compute for editing and rendering.',
    'The OLED panel alone justifies the price. A genuine desktop replacement.',
    '[{"label":"GPU","value":"NVIDIA GTX 1650Ti"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuDx6_dgrrf40sr1S2UXUf9Zg1iO9IAbyQXpGcA_ULrM7DFn9S23GV09KQDHls1GR8SI4Dg9y4UNx5cadAKNz80UnfhLElqyp6O1dbf2217KgVZ1m5Gr3nMo76xHbSZEAcg0QqMWCU6jLHWRMU3fKBMljr4HYucAn-IKHluT4M_Ig9Yehy90eBOpnTTdTfv0UCIfIsJw6RNhHX_9pGuEiTq9xHpkdhVgT9u7JinuyqGVXhHmFagzYVsezoQVIj_wSJBA72BMS-KZ8uc"]'::jsonb,
    '["CREATOR"]'::jsonb,
    2, true, false
  ),
  (
    'macbook-pro-14-m1-pro', 'Apple MacBook Pro 14" (M1 Pro)', 'Apple', 1299, 1599, 'USD', 'GRADE A MINT',
    'M1 Pro (8-Core)', '16GB Unified', '512GB SSD', '14.2" Liquid Retina XDR', '> 90% CAPACITY',
    'Uncompromising performance for professionals. Refurbished to pristine condition, thoroughly tested, and ready for heavy workloads.',
    'Professional-grade power with zero corporate markup. The mini-LED display is reference quality.',
    '[{"label":"GPU","value":"14-Core GPU"},{"label":"PORTS","value":"3x TB4, HDMI, SDXC"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuD51VHNHszqmtYTo7ZMHex-2yonyUVMxHitwqBDUpY2HjUAIXzieBN87grioIJBgOIPgAscLn8syxlpEz-LsRSp0dfsinHg8SlYIotr7kQ9TV1yheG94swyjm5ddhCJxDgfJ7XK-CsjyNzBhm5ujtUkNlaB1B-9IDiXlcPZeDUAB3BjQhMHXk_gilKsJxFVn7szZSJdAqQDy2ASrjrOCXBqgwBSvdgeumPYYX1zOcfyTxhzwt7TT66kuzJZoo0xJKlWG2fQ7KSoNGo"]'::jsonb,
    '["GRADE A MINT","6 MONTH WARRANTY"]'::jsonb,
    4, true, true
  ),
  (
    'thinkpad-x1-carbon-gen-9', 'ThinkPad X1 Carbon Gen 9', 'Lenovo', 899, 999, 'USD', 'GRADE A',
    'Intel i7-1185G7', '16GB LPDDR4x', '512GB NVMe SSD', '14" WUXGA IPS', '> 92% CAPACITY',
    'Featherweight carbon-fibre chassis with business-class durability and a gorgeous 16:10 panel.',
    'Uncompromising performance in a ridiculously light form factor. This machine was built for the executive suite and priced for the trenches. Professionally refurbished to Grade A standards. Zero distractions, maximum output.',
    '[{"label":"WEIGHT","value":"1.13 kg"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuD51VHNHszqmtYTo7ZMHex-2yonyUVMxHitwqBDUpY2HjUAIXzieBN87grioIJBgOIPgAscLn8syxlpEz-LsRSp0dfsinHg8SlYIotr7kQ9TV1yheG94swyjm5ddhCJxDgfJ7XK-CsjyNzBhm5ujtUkNlaB1B-9IDiXlcPZeDUAB3BjQhMHXk_gilKsJxFVn7szZSJdAqQDy2ASrjrOCXBqgwBSvdgeumPYYX1zOcfyTxhzwt7TT66kuzJZoo0xJKlWG2fQ7KSoNGo"]'::jsonb,
    '["IN STOCK","READY TO SHIP"]'::jsonb,
    5, true, false
  )
on conflict (slug) do nothing;
