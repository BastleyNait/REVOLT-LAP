-- REVOLT — seed data (mirrors src/lib/data/fallback-products.ts)
-- Catálogo: laptops Intel Core i7 11va generación (fuente: eBay refurbished).
-- Costo de compra <= $200 USD; precio de venta en soles (PEN) = costo x ~3.7 + 800.
-- Safe to re-run: conflicts on slug are ignored.
-- ============================================================================

insert into public.products
  (slug, name, brand, price, original_price, currency, condition_grade,
   processor, ram, storage, display, battery_health, description, verdict,
   specs, images, badges, stock, is_active, is_featured)
values
  (
    'dell-latitude-5420-i7-11', 'Dell Latitude 5420', 'Dell', 1410, 1750, 'PEN', 'Grado A',
    'Intel Core i7-1165G7 (11.ª gen.)', '16GB DDR4', '512GB NVMe SSD', '14" FHD IPS', '> 85% de capacidad',
    'El caballo de batalla empresarial. i7 de 11va generación con vPro, chasis reforzado y teclado retroiluminado. Reacondicionado y listo para toda una jornada de trabajo.',
    'Rendimiento de oficina sin sobreprecio corporativo. Ligera, resistente y con la mejor relación precio-potencia del inventario.',
    '[{"label":"PUERTOS","value":"USB-C/TB4, HDMI, RJ45, lector SD"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuAFejqBTHyDYdAVe6IEpTfL8i4WGgfSTrD5QDKLMcc_HA5VubNvDxg9_1iBFpYY_alOVs9R8qJMhIQ_-PDqNei9Yh6NtS0eFrpiJ_oCoQapz9MLPHVevmE_CuzMNKa482CGYT5w1pqtQvBcel_dKS9Exrnajc_rkL0UwAXSwYOGGT_ZbF0B8QDEdhd1_jL78oHMY3Q4qErlkpugWKXvk8BifBDNVbq2quvzLkH8i-l4SkO9yg1qBXbU285BlXHaA_eCnnnWoHQXanc"]'::jsonb,
    '["MÁS VENDIDA"]'::jsonb,
    6, true, true
  ),
  (
    'dell-latitude-7420-i7-11', 'Dell Latitude 7420', 'Dell', 1520, 1900, 'PEN', 'Grado A+ · Como nueva',
    'Intel Core i7-1185G7 vPro (11.ª gen.)', '16GB LPDDR4x', '512GB NVMe SSD', '14" FHD (100% sRGB)', '> 90% de capacidad',
    'La serie premium de Dell para ejecutivos. Chasis de aluminio, ultraligera y con el i7-1185G7 vPro, el tope de gama de la 11va generación.',
    'La más fina y elegante de las Latitude. Silenciosa, rápida y con una pantalla brillante. Un lujo de oficina a precio de reacondicionado.',
    '[{"label":"PESO","value":"1.29 kg"},{"label":"PUERTOS","value":"2x TB4, HDMI, USB-A"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuDx6_dgrrf40sr1S2UXUf9Zg1iO9IAbyQXpGcA_ULrM7DFn9S23GV09KQDHls1GR8SI4Dg9y4UNx5cadAKNz80UnfhLElqyp6O1dbf2217KgVZ1m5Gr3nMo76xHbSZEAcg0QqMWCU6jLHWRMU3fKBMljr4HYucAn-IKHluT4M_Ig9Yehy90eBOpnTTdTfv0UCIfIsJw6RNhHX_9pGuEiTq9xHpkdhVgT9u7JinuyqGVXhHmFagzYVsezoQVIj_wSJBA72BMS-KZ8uc"]'::jsonb,
    '["Grado A+ · Como nueva"]'::jsonb,
    4, true, true
  ),
  (
    'dell-latitude-5520-i7-11', 'Dell Latitude 5520', 'Dell', 1450, 1800, 'PEN', 'Grado A',
    'Intel Core i7-1165G7 (11.ª gen.)', '16GB DDR4', '512GB NVMe SSD', '15.6" FHD IPS', '> 88% de capacidad',
    'Pantalla grande de 15.6" para quienes necesitan espacio de trabajo. i7 de 11va generación, teclado numérico completo y expansión de RAM.',
    'La opción de pantalla amplia. Ideal para hojas de cálculo, multitarea y trabajo prolongado sin fatiga visual.',
    '[{"label":"PUERTOS","value":"USB-C/TB4, 2x USB-A, HDMI, RJ45"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuD51VHNHszqmtYTo7ZMHex-2yonyUVMxHitwqBDUpY2HjUAIXzieBN87grioIJBgOIPgAscLn8syxlpEz-LsRSp0dfsinHg8SlYIotr7kQ9TV1yheG94swyjm5ddhCJxDgfJ7XK-CsjyNzBhm5ujtUkNlaB1B-9IDiXlcPZeDUAB3BjQhMHXk_gilKsJxFVn7szZSJdAqQDy2ASrjrOCXBqgwBSvdgeumPYYX1zOcfyTxhzwt7TT66kuzJZoo0xJKlWG2fQ7KSoNGo"]'::jsonb,
    '["PANTALLA 15.6\""]'::jsonb,
    5, true, false
  ),
  (
    'lenovo-thinkpad-p14s-gen-2-i7-11', 'Lenovo ThinkPad P14s Gen 2', 'Lenovo', 1500, 1950, 'PEN', 'Grado A',
    'Intel Core i7-1165G7 (11.ª gen.)', '16GB DDR4', '512GB NVMe SSD', '14" FHD IPS', '> 88% de capacidad',
    'Workstation portátil con gráficos dedicados NVIDIA T500. El legendario teclado ThinkPad y certificación militar de durabilidad.',
    'La única del catálogo con GPU dedicada. Para diseño CAD ligero, edición y quien exige el teclado más cómodo del mercado.',
    '[{"label":"GPU","value":"NVIDIA T500 4GB"},{"label":"PUERTOS","value":"2x TB4, 2x USB-A, HDMI, RJ45"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuD51VHNHszqmtYTo7ZMHex-2yonyUVMxHitwqBDUpY2HjUAIXzieBN87grioIJBgOIPgAscLn8syxlpEz-LsRSp0dfsinHg8SlYIotr7kQ9TV1yheG94swyjm5ddhCJxDgfJ7XK-CsjyNzBhm5ujtUkNlaB1B-9IDiXlcPZeDUAB3BjQhMHXk_gilKsJxFVn7szZSJdAqQDy2ASrjrOCXBqgwBSvdgeumPYYX1zOcfyTxhzwt7TT66kuzJZoo0xJKlWG2fQ7KSoNGo"]'::jsonb,
    '["GPU DEDICADA"]'::jsonb,
    3, true, true
  ),
  (
    'hp-elitebook-840-g8-i7-11', 'HP EliteBook 840 G8', 'HP', 1480, 1850, 'PEN', 'Grado A',
    'Intel Core i7-1165G7 (11.ª gen.)', '16GB DDR4', '512GB NVMe SSD', '14" FHD IPS', '> 87% de capacidad',
    'El estándar corporativo de HP. Chasis de aluminio, seguridad Sure View y una de las mejores webcams con obturador de privacidad.',
    'Elegante, segura y bien construida. Una alternativa premium con acabado de aluminio a precio imbatible.',
    '[{"label":"PUERTOS","value":"2x TB4, 2x USB-A, HDMI, RJ45"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuBlRzYH8L-udqDBH261pTgfKqCbC0YcfMzWcW7uSpq3hq96w2USyimYF2JuMwH6kynF8mkw8gUZVkIt1u6FgRkDVphCUyNzewmhB-XboO0eQgyMj9y_GOXufZ_HkZiiEmjU8mX6FeoQ6tzk4-5ZOX4CJd54r4Cj1EvmVqjcFfvYvDtgoePe9TX4yQT6bEV-3SxC228PmQwGAJY7nYkepaItQuRl4CrjetJghkn8Lgp_BDDSYt_07Tc2Ktzq5ALMbMNTOhCwc_5LRjg"]'::jsonb,
    '["ALUMINIO"]'::jsonb,
    5, true, false
  ),
  (
    'lenovo-thinkpad-x1-carbon-gen-9-i7-11', 'Lenovo ThinkPad X1 Carbon Gen 9', 'Lenovo', 1540, 2100, 'PEN', 'Grado A+ · Como nueva',
    'Intel Core i7-1185G7 (11.ª gen.)', '16GB LPDDR4x', '512GB NVMe SSD', '14" WUXGA IPS (16:10)', '> 90% de capacidad',
    'El buque insignia ultraligero de Lenovo. Fibra de carbono, apenas 1.13 kg y el brillante panel 16:10. Plataforma Intel Evo.',
    'Rendimiento sin concesiones en el formato más ligero posible. Construida para la alta dirección y ahora a tu alcance.',
    '[{"label":"PESO","value":"1.13 kg"},{"label":"PUERTOS","value":"2x TB4, 2x USB-A, HDMI"}]'::jsonb,
    '["https://lh3.googleusercontent.com/aida-public/AB6AXuD51VHNHszqmtYTo7ZMHex-2yonyUVMxHitwqBDUpY2HjUAIXzieBN87grioIJBgOIPgAscLn8syxlpEz-LsRSp0dfsinHg8SlYIotr7kQ9TV1yheG94swyjm5ddhCJxDgfJ7XK-CsjyNzBhm5ujtUkNlaB1B-9IDiXlcPZeDUAB3BjQhMHXk_gilKsJxFVn7szZSJdAqQDy2ASrjrOCXBqgwBSvdgeumPYYX1zOcfyTxhzwt7TT66kuzJZoo0xJKlWG2fQ7KSoNGo"]'::jsonb,
    '["ULTRALIGERA","1.13 KG"]'::jsonb,
    2, true, false
  )
on conflict (slug) do nothing;
