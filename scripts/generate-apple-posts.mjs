#!/usr/bin/env node
/**
 * Generates markdown articles for Apple products (iPhones and MacBooks)
 * Output: sites/apple/posts/
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const outputDir = join(rootDir, "sites", "apple", "posts");

const iPhones = [
  { name: "iPhone 4", slug: "iphone-4-2010", year: 2010, month: 6, specs: { display: "3.5-inch Retina (960×640, 326 ppi)", processor: "Apple A4", storage: "8GB, 16GB, 32GB", camera: "5MP rear, VGA front", battery: "1420 mAh" }, design: "Glass front and back with stainless steel frame" },
  { name: "iPhone 4S", slug: "iphone-4s-2011", year: 2011, month: 10, specs: { display: "3.5-inch Retina (960×640, 326 ppi)", processor: "Apple A5", storage: "8GB, 16GB, 32GB, 64GB", camera: "8MP rear, VGA front", battery: "1432 mAh" }, design: "Same glass and steel design as iPhone 4" },
  { name: "iPhone 5", slug: "iphone-5-2012", year: 2012, month: 9, specs: { display: "4-inch Retina (1136×640, 326 ppi)", processor: "Apple A6", storage: "16GB, 32GB, 64GB", camera: "8MP rear, 1.2MP front", battery: "1440 mAh" }, design: "Aluminum unibody, Lightning connector" },
  { name: "iPhone 5s", slug: "iphone-5s-2013", year: 2013, month: 9, specs: { display: "4-inch Retina (1136×640, 326 ppi)", processor: "Apple A7 (64-bit)", storage: "16GB, 32GB, 64GB", camera: "8MP rear with True Tone flash, 1.2MP front", battery: "1570 mAh" }, design: "Touch ID, aluminum with chamfered edges" },
  { name: "iPhone 5c", slug: "iphone-5c-2013", year: 2013, month: 9, specs: { display: "4-inch Retina (1136×640, 326 ppi)", processor: "Apple A6", storage: "8GB, 16GB, 32GB", camera: "8MP rear, 1.2MP front", battery: "1510 mAh" }, design: "Polycarbonate shell in five colors" },
  { name: "iPhone 6", slug: "iphone-6-2014", year: 2014, month: 9, specs: { display: "4.7-inch Retina HD (1334×750, 326 ppi)", processor: "Apple A8", storage: "16GB, 64GB, 128GB", camera: "8MP rear, 1.2MP front", battery: "1810 mAh" }, design: "Curved aluminum, 6.9mm thin" },
  { name: "iPhone 6 Plus", slug: "iphone-6-plus-2014", year: 2014, month: 9, specs: { display: "5.5-inch Retina HD (1920×1080, 401 ppi)", processor: "Apple A8", storage: "16GB, 64GB, 128GB", camera: "8MP rear with OIS, 1.2MP front", battery: "2915 mAh" }, design: "Larger form factor, optical image stabilization" },
  { name: "iPhone 6s", slug: "iphone-6s-2015", year: 2015, month: 9, specs: { display: "4.7-inch Retina HD (1334×750, 326 ppi)", processor: "Apple A9", storage: "16GB, 32GB, 64GB, 128GB", camera: "12MP rear, 5MP front", battery: "1715 mAh" }, design: "3D Touch, 7000 series aluminum" },
  { name: "iPhone 6s Plus", slug: "iphone-6s-plus-2015", year: 2015, month: 9, specs: { display: "5.5-inch Retina HD (1920×1080, 401 ppi)", processor: "Apple A9", storage: "16GB, 32GB, 64GB, 128GB", camera: "12MP rear with OIS, 5MP front", battery: "2750 mAh" }, design: "3D Touch on larger display" },
  { name: "iPhone SE (2016)", slug: "iphone-se-2016", year: 2016, month: 3, specs: { display: "4-inch Retina (1136×640, 326 ppi)", processor: "Apple A9", storage: "16GB, 64GB", camera: "12MP rear, 1.2MP front", battery: "1624 mAh" }, design: "iPhone 5s body with upgraded internals" },
  { name: "iPhone 7", slug: "iphone-7-2016", year: 2016, month: 9, specs: { display: "4.7-inch Retina HD (1334×750, 326 ppi)", processor: "Apple A10 Fusion", storage: "32GB, 128GB, 256GB", camera: "12MP rear, 7MP front", battery: "1960 mAh" }, design: "Water resistant, no headphone jack" },
  { name: "iPhone 7 Plus", slug: "iphone-7-plus-2016", year: 2016, month: 9, specs: { display: "5.5-inch Retina HD (1920×1080, 401 ppi)", processor: "Apple A10 Fusion", storage: "32GB, 128GB, 256GB", camera: "Dual 12MP (wide + telephoto), 7MP front", battery: "2900 mAh" }, design: "Dual camera system, Portrait mode" },
  { name: "iPhone 8", slug: "iphone-8-2017", year: 2017, month: 9, specs: { display: "4.7-inch Retina HD (1334×750, 326 ppi)", processor: "Apple A11 Bionic", storage: "64GB, 128GB, 256GB", camera: "12MP rear, 7MP front", battery: "1821 mAh" }, design: "Glass back, wireless charging" },
  { name: "iPhone 8 Plus", slug: "iphone-8-plus-2017", year: 2017, month: 9, specs: { display: "5.5-inch Retina HD (1920×1080, 401 ppi)", processor: "Apple A11 Bionic", storage: "64GB, 128GB, 256GB", camera: "Dual 12MP (wide + telephoto), 7MP front", battery: "2691 mAh" }, design: "Glass back, wireless charging" },
  { name: "iPhone X", slug: "iphone-x-2017", year: 2017, month: 11, specs: { display: "5.8-inch Super Retina OLED (2436×1125, 458 ppi)", processor: "Apple A11 Bionic", storage: "64GB, 256GB", camera: "Dual 12MP (wide + telephoto), 7MP TrueDepth front", battery: "2716 mAh" }, design: "Edge-to-edge OLED, Face ID, notch" },
  { name: "iPhone XR", slug: "iphone-xr-2018", year: 2018, month: 10, specs: { display: "6.1-inch Liquid Retina LCD (1792×828, 326 ppi)", processor: "Apple A12 Bionic", storage: "64GB, 128GB, 256GB", camera: "12MP rear, 7MP TrueDepth front", battery: "2942 mAh" }, design: "Aluminum frame, six colors" },
  { name: "iPhone XS", slug: "iphone-xs-2018", year: 2018, month: 9, specs: { display: "5.8-inch Super Retina OLED (2436×1125, 458 ppi)", processor: "Apple A12 Bionic", storage: "64GB, 256GB, 512GB", camera: "Dual 12MP (wide + telephoto), 7MP TrueDepth front", battery: "2658 mAh" }, design: "Stainless steel, gold option" },
  { name: "iPhone XS Max", slug: "iphone-xs-max-2018", year: 2018, month: 9, specs: { display: "6.5-inch Super Retina OLED (2688×1242, 458 ppi)", processor: "Apple A12 Bionic", storage: "64GB, 256GB, 512GB", camera: "Dual 12MP (wide + telephoto), 7MP TrueDepth front", battery: "3174 mAh" }, design: "Largest iPhone at the time" },
  { name: "iPhone 11", slug: "iphone-11-2019", year: 2019, month: 9, specs: { display: "6.1-inch Liquid Retina LCD (1792×828, 326 ppi)", processor: "Apple A13 Bionic", storage: "64GB, 128GB, 256GB", camera: "Dual 12MP (wide + ultra wide), 12MP front", battery: "3110 mAh" }, design: "Aluminum, six colors" },
  { name: "iPhone 11 Pro", slug: "iphone-11-pro-2019", year: 2019, month: 9, specs: { display: "5.8-inch Super Retina XDR OLED (2436×1125, 458 ppi)", processor: "Apple A13 Bionic", storage: "64GB, 256GB, 512GB", camera: "Triple 12MP (wide + telephoto + ultra wide), 12MP front", battery: "3046 mAh" }, design: "Matte glass, stainless steel" },
  { name: "iPhone 11 Pro Max", slug: "iphone-11-pro-max-2019", year: 2019, month: 9, specs: { display: "6.5-inch Super Retina XDR OLED (2688×1242, 458 ppi)", processor: "Apple A13 Bionic", storage: "64GB, 256GB, 512GB", camera: "Triple 12MP (wide + telephoto + ultra wide), 12MP front", battery: "3969 mAh" }, design: "Largest Pro model" },
  { name: "iPhone SE (2020)", slug: "iphone-se-2020", year: 2020, month: 4, specs: { display: "4.7-inch Retina HD (1334×750, 326 ppi)", processor: "Apple A13 Bionic", storage: "64GB, 128GB, 256GB", camera: "12MP rear, 7MP front", battery: "1821 mAh" }, design: "iPhone 8 body, Touch ID" },
  { name: "iPhone 12", slug: "iphone-12-2020", year: 2020, month: 10, specs: { display: "6.1-inch Super Retina XDR OLED (2532×1170, 460 ppi)", processor: "Apple A14 Bionic", storage: "64GB, 128GB, 256GB", camera: "Dual 12MP (wide + ultra wide), 12MP front", battery: "2815 mAh" }, design: "Flat edges, Ceramic Shield, 5G" },
  { name: "iPhone 12 mini", slug: "iphone-12-mini-2020", year: 2020, month: 11, specs: { display: "5.4-inch Super Retina XDR OLED (2340×1080, 476 ppi)", processor: "Apple A14 Bionic", storage: "64GB, 128GB, 256GB", camera: "Dual 12MP (wide + ultra wide), 12MP front", battery: "2227 mAh" }, design: "Compact flagship" },
  { name: "iPhone 12 Pro", slug: "iphone-12-pro-2020", year: 2020, month: 10, specs: { display: "6.1-inch Super Retina XDR OLED (2532×1170, 460 ppi)", processor: "Apple A14 Bionic", storage: "128GB, 256GB, 512GB", camera: "Triple 12MP (wide + telephoto + ultra wide), 12MP front", battery: "2815 mAh" }, design: "Stainless steel, LiDAR" },
  { name: "iPhone 12 Pro Max", slug: "iphone-12-pro-max-2020", year: 2020, month: 11, specs: { display: "6.7-inch Super Retina XDR OLED (2778×1284, 458 ppi)", processor: "Apple A14 Bionic", storage: "128GB, 256GB, 512GB", camera: "Triple 12MP with sensor-shift OIS, 12MP front", battery: "3687 mAh" }, design: "Largest display, ProRAW" },
  { name: "iPhone 13", slug: "iphone-13-2021", year: 2021, month: 9, specs: { display: "6.1-inch Super Retina XDR OLED (2532×1170, 460 ppi)", processor: "Apple A15 Bionic", storage: "128GB, 256GB, 512GB", camera: "Dual 12MP (wide + ultra wide), 12MP front", battery: "3240 mAh" }, design: "Diagonal camera layout" },
  { name: "iPhone 13 mini", slug: "iphone-13-mini-2021", year: 2021, month: 9, specs: { display: "5.4-inch Super Retina XDR OLED (2340×1080, 476 ppi)", processor: "Apple A15 Bionic", storage: "128GB, 256GB, 512GB", camera: "Dual 12MP (wide + ultra wide), 12MP front", battery: "2438 mAh" }, design: "Compact with longer battery" },
  { name: "iPhone 13 Pro", slug: "iphone-13-pro-2021", year: 2021, month: 9, specs: { display: "6.1-inch ProMotion OLED (2532×1170, 120Hz)", processor: "Apple A15 Bionic", storage: "128GB, 256GB, 512GB, 1TB", camera: "Triple 12MP with macro, 12MP front", battery: "3095 mAh" }, design: "ProMotion, ProRes video" },
  { name: "iPhone 13 Pro Max", slug: "iphone-13-pro-max-2021", year: 2021, month: 9, specs: { display: "6.7-inch ProMotion OLED (2778×1284, 120Hz)", processor: "Apple A15 Bionic", storage: "128GB, 256GB, 512GB, 1TB", camera: "Triple 12MP with macro, 12MP front", battery: "4352 mAh" }, design: "Best battery life" },
  { name: "iPhone SE (2022)", slug: "iphone-se-2022", year: 2022, month: 3, specs: { display: "4.7-inch Retina HD (1334×750, 326 ppi)", processor: "Apple A15 Bionic", storage: "64GB, 128GB, 256GB", camera: "12MP rear, 7MP front", battery: "2018 mAh" }, design: "iPhone 8 design, 5G" },
  { name: "iPhone 14", slug: "iphone-14-2022", year: 2022, month: 9, specs: { display: "6.1-inch Super Retina XDR OLED (2532×1170, 460 ppi)", processor: "Apple A15 Bionic", storage: "128GB, 256GB, 512GB", camera: "Dual 12MP (wide + ultra wide), 12MP front", battery: "3279 mAh" }, design: "Crash Detection, satellite SOS" },
  { name: "iPhone 14 Plus", slug: "iphone-14-plus-2022", year: 2022, month: 9, specs: { display: "6.7-inch Super Retina XDR OLED (2778×1284, 458 ppi)", processor: "Apple A15 Bionic", storage: "128GB, 256GB, 512GB", camera: "Dual 12MP (wide + ultra wide), 12MP front", battery: "4323 mAh" }, design: "Large screen without Pro price" },
  { name: "iPhone 14 Pro", slug: "iphone-14-pro-2022", year: 2022, month: 9, specs: { display: "6.1-inch ProMotion OLED (2556×1179, 120Hz)", processor: "Apple A16 Bionic", storage: "128GB, 256GB, 512GB, 1TB", camera: "48MP main + 12MP ultra wide + 12MP telephoto, 12MP front", battery: "3200 mAh" }, design: "Dynamic Island, Always-On display" },
  { name: "iPhone 14 Pro Max", slug: "iphone-14-pro-max-2022", year: 2022, month: 9, specs: { display: "6.7-inch ProMotion OLED (2796×1290, 120Hz)", processor: "Apple A16 Bionic", storage: "128GB, 256GB, 512GB, 1TB", camera: "48MP main + 12MP ultra wide + 12MP telephoto, 12MP front", battery: "4323 mAh" }, design: "Dynamic Island on Max" },
  { name: "iPhone 15", slug: "iphone-15-2023", year: 2023, month: 9, specs: { display: "6.1-inch Super Retina XDR OLED (2556×1179, 460 ppi)", processor: "Apple A16 Bionic", storage: "128GB, 256GB, 512GB", camera: "48MP main + 12MP ultra wide, 12MP front", battery: "3349 mAh" }, design: "USB-C, Dynamic Island" },
  { name: "iPhone 15 Plus", slug: "iphone-15-plus-2023", year: 2023, month: 9, specs: { display: "6.7-inch Super Retina XDR OLED (2796×1290, 460 ppi)", processor: "Apple A16 Bionic", storage: "128GB, 256GB, 512GB", camera: "48MP main + 12MP ultra wide, 12MP front", battery: "4383 mAh" }, design: "USB-C, titanium-free option" },
  { name: "iPhone 15 Pro", slug: "iphone-15-pro-2023", year: 2023, month: 9, specs: { display: "6.1-inch ProMotion OLED (2556×1179, 120Hz)", processor: "Apple A17 Pro", storage: "128GB, 256GB, 512GB, 1TB", camera: "48MP main + 12MP ultra wide + 12MP telephoto, 12MP front", battery: "3274 mAh" }, design: "Titanium, Action button" },
  { name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max-2023", year: 2023, month: 9, specs: { display: "6.7-inch ProMotion OLED (2796×1290, 120Hz)", processor: "Apple A17 Pro", storage: "256GB, 512GB, 1TB", camera: "48MP main + 12MP ultra wide + 5x telephoto, 12MP front", battery: "4422 mAh" }, design: "Titanium, 5x optical zoom" },
  { name: "iPhone 16", slug: "iphone-16-2024", year: 2024, month: 9, specs: { display: "6.1-inch Super Retina XDR OLED (2556×1179, 460 ppi)", processor: "Apple A18", storage: "128GB, 256GB, 512GB", camera: "48MP main + 12MP ultra wide, 12MP front", battery: "3561 mAh" }, design: "Camera Control, USB-C" },
  { name: "iPhone 16 Plus", slug: "iphone-16-plus-2024", year: 2024, month: 9, specs: { display: "6.7-inch Super Retina XDR OLED (2796×1290, 460 ppi)", processor: "Apple A18", storage: "128GB, 256GB, 512GB", camera: "48MP main + 12MP ultra wide, 12MP front", battery: "4006 mAh" }, design: "Largest standard iPhone" },
  { name: "iPhone 16 Pro", slug: "iphone-16-pro-2024", year: 2024, month: 9, specs: { display: "6.3-inch ProMotion OLED (2622×1206, 120Hz)", processor: "Apple A18 Pro", storage: "256GB, 512GB, 1TB", camera: "48MP main + 48MP ultra wide + 5x telephoto, 12MP front", battery: "3582 mAh" }, design: "Titanium frame with brushed finish, new Capture button for quick camera access, thinnest bezels on any iPhone" },
  { name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max-2024", year: 2024, month: 9, specs: { display: "6.9-inch ProMotion OLED (2868×1320, 120Hz)", processor: "Apple A18 Pro", storage: "256GB, 512GB, 1TB", camera: "48MP main + 48MP ultra wide + 5x telephoto, 12MP front", battery: "4685 mAh" }, design: "Titanium design, largest iPhone display ever, best battery life in the lineup" },
];

const macBooks = [
  { name: "MacBook Air", slug: "macbook-air-2010", year: 2010, month: 10, model: "11\" & 13\"", specs: { display: "11.6\" or 13.3\" LED (1366×768 or 1440×900)", processor: "Intel Core 2 Duo 1.4-2.13 GHz", storage: "64GB or 128GB SSD", memory: "2GB DDR3", battery: "35 Wh, up to 5 hours" }, design: "Unibody aluminum, wedge shape" },
  { name: "MacBook Air", slug: "macbook-air-2011", year: 2011, month: 7, model: "11\" & 13\"", specs: { display: "11.6\" or 13.3\" LED (1366×768 or 1440×900)", processor: "Intel Core i5/i7 (Sandy Bridge)", storage: "64-256GB SSD", memory: "4GB DDR3", battery: "35-50 Wh" }, design: "Thunderbolt, backlit keyboard" },
  { name: "MacBook Air", slug: "macbook-air-2012", year: 2012, month: 6, model: "11\" & 13\"", specs: { display: "11.6\" or 13.3\" LED (1366×768 or 1440×900)", processor: "Intel Core i5/i7 (Ivy Bridge)", storage: "64-512GB SSD", memory: "4-8GB DDR3", battery: "35-50 Wh" }, design: "USB 3.0" },
  { name: "MacBook Air", slug: "macbook-air-2013", year: 2013, month: 6, model: "11\" & 13\"", specs: { display: "11.6\" or 13.3\" LED (1366×768 or 1440×900)", processor: "Intel Core i5/i7 (Haswell)", storage: "128-512GB SSD", memory: "4-8GB DDR3", battery: "38-54 Wh, up to 12 hours" }, design: "Haswell efficiency" },
  { name: "MacBook Air", slug: "macbook-air-2014", year: 2014, month: 4, model: "11\" & 13\"", specs: { display: "11.6\" or 13.3\" LED (1366×768 or 1440×900)", processor: "Intel Core i5/i7 (Haswell)", storage: "128-512GB SSD", memory: "4-8GB DDR3", battery: "38-54 Wh" }, design: "Minor speed bump" },
  { name: "MacBook Air", slug: "macbook-air-2015", year: 2015, month: 3, model: "11\" & 13\"", specs: { display: "11.6\" or 13.3\" LED (1366×768 or 1440×900)", processor: "Intel Core i5/i7 (Broadwell)", storage: "128-512GB SSD", memory: "4-8GB DDR3", battery: "38-54 Wh" }, design: "Force Touch trackpad" },
  { name: "MacBook Air", slug: "macbook-air-2017", year: 2017, month: 6, model: "13\"", specs: { display: "13.3\" LED (1440×900)", processor: "Intel Core i5/i7 (Kaby Lake)", storage: "128-256GB SSD", memory: "8GB DDR3", battery: "54 Wh" }, design: "11\" discontinued" },
  { name: "MacBook Air", slug: "macbook-air-2018", year: 2018, month: 10, model: "13\" Retina", specs: { display: "13.3\" Retina (2560×1600)", processor: "Intel Core i5 (Amber Lake)", storage: "128-256GB SSD", memory: "8-16GB DDR3", battery: "50 Wh" }, design: "Retina display, Touch ID" },
  { name: "MacBook Air", slug: "macbook-air-2019", year: 2019, month: 7, model: "13\" Retina", specs: { display: "13.3\" Retina (2560×1600)", processor: "Intel Core i5 (Amber Lake)", storage: "128-256GB SSD", memory: "8-16GB DDR3", battery: "50 Wh" }, design: "True Tone display" },
  { name: "MacBook Air", slug: "macbook-air-m1-2020", year: 2020, month: 3, model: "M1", specs: { display: "13.3\" Retina (2560×1600)", processor: "Apple M1", storage: "256GB-2TB SSD", memory: "8-16GB unified", battery: "49.9 Wh, up to 18 hours" }, design: "M1 chip, fanless" },
  { name: "MacBook Air", slug: "macbook-air-m2-2022", year: 2022, month: 7, model: "M2", specs: { display: "13.6\" Liquid Retina (2560×1664)", processor: "Apple M2", storage: "256GB-2TB SSD", memory: "8-24GB unified", battery: "52.6 Wh, up to 18 hours" }, design: "Flat design, MagSafe" },
  { name: "MacBook Air", slug: "macbook-air-m2-15-2023", year: 2023, month: 6, model: "M2 15\"", specs: { display: "15.3\" Liquid Retina (2880×1864)", processor: "Apple M2", storage: "256GB-2TB SSD", memory: "8-24GB unified", battery: "66.5 Wh" }, design: "15-inch option" },
  { name: "MacBook Air", slug: "macbook-air-m3-2024", year: 2024, month: 3, model: "M3", specs: { display: "13.6\" or 15.3\" Liquid Retina", processor: "Apple M3", storage: "256GB-2TB SSD", memory: "8-24GB unified", battery: "52.6-66.5 Wh" }, design: "M3, dual external displays" },
  { name: "MacBook Pro", slug: "macbook-pro-2010", year: 2010, month: 4, model: "13\" & 15\"", specs: { display: "13.3\" or 15.4\" (1280×800 or 1440×900)", processor: "Intel Core 2 Duo / Core i5/i7", storage: "250-500GB HDD", memory: "4-8GB DDR3", battery: "63-77 Wh" }, design: "Unibody, first 13\" Pro" },
  { name: "MacBook Pro", slug: "macbook-pro-2011", year: 2011, month: 2, model: "13\" & 15\" & 17\"", specs: { display: "13.3\", 15.4\", or 17\"", processor: "Intel Core i5/i7 (Sandy Bridge)", storage: "320GB-750GB HDD", memory: "4-8GB DDR3", battery: "63-95 Wh" }, design: "Thunderbolt" },
  { name: "MacBook Pro", slug: "macbook-pro-2012", year: 2012, month: 6, model: "Retina", specs: { display: "15.4\" Retina (2880×1800)", processor: "Intel Core i7 (Ivy Bridge)", storage: "256GB-768GB SSD", memory: "8-16GB DDR3", battery: "95 Wh" }, design: "First Retina MacBook Pro" },
  { name: "MacBook Pro", slug: "macbook-pro-2013", year: 2013, month: 10, model: "Retina", specs: { display: "13.3\" or 15.4\" Retina", processor: "Intel Core i5/i7 (Haswell)", storage: "128GB-1TB SSD", memory: "8-16GB DDR3", battery: "71-99 Wh" }, design: "Haswell, PCIe SSD" },
  { name: "MacBook Pro", slug: "macbook-pro-2014", year: 2014, month: 7, model: "Retina", specs: { display: "13.3\" or 15.4\" Retina", processor: "Intel Core i5/i7 (Haswell)", storage: "128GB-1TB SSD", memory: "8-16GB DDR3", battery: "71-99 Wh" }, design: "Faster PCIe" },
  { name: "MacBook Pro", slug: "macbook-pro-2015", year: 2015, month: 3, model: "Retina", specs: { display: "13.3\" or 15.4\" Retina", processor: "Intel Core i5/i7 (Broadwell)", storage: "128GB-1TB SSD", memory: "8-16GB DDR3", battery: "74-99 Wh" }, design: "Force Touch, faster SSD" },
  { name: "MacBook Pro", slug: "macbook-pro-2016", year: 2016, month: 10, model: "Touch Bar", specs: { display: "13.3\" or 15.4\" Retina", processor: "Intel Core i5/i7 (Skylake)", storage: "256GB-2TB SSD", memory: "8-16GB DDR3", battery: "54-76 Wh" }, design: "Touch Bar, USB-C only" },
  { name: "MacBook Pro", slug: "macbook-pro-2017", year: 2017, month: 6, model: "Touch Bar", specs: { display: "13.3\" or 15.4\" Retina", processor: "Intel Core i5/i7 (Kaby Lake)", storage: "256GB-2TB SSD", memory: "8-16GB DDR3", battery: "54-76 Wh" }, design: "Kaby Lake" },
  { name: "MacBook Pro", slug: "macbook-pro-2018", year: 2018, month: 7, model: "Touch Bar", specs: { display: "13.3\" or 15.4\" Retina", processor: "Intel Core i5/i7/i9 (Coffee Lake)", storage: "256GB-4TB SSD", memory: "8-32GB DDR4", battery: "58-83 Wh" }, design: "8th gen, 32GB option" },
  { name: "MacBook Pro", slug: "macbook-pro-2019", year: 2019, month: 11, model: "16\"", specs: { display: "13.3\" or 16\" Retina", processor: "Intel Core i5/i7/i9", storage: "256GB-8TB SSD", memory: "8-64GB DDR4", battery: "58-100 Wh" }, design: "16\" return, scissor keyboard" },
  { name: "MacBook Pro", slug: "macbook-pro-m1-2020", year: 2020, month: 11, model: "M1", specs: { display: "13.3\" Retina (2560×1600)", processor: "Apple M1", storage: "256GB-2TB SSD", memory: "8-16GB unified", battery: "58 Wh, up to 20 hours" }, design: "First Apple Silicon MacBook Pro" },
  { name: "MacBook Pro", slug: "macbook-pro-m1-pro-max-2021", year: 2021, month: 10, model: "M1 Pro/Max", specs: { display: "14.2\" or 16.2\" Liquid Retina XDR (3024×1964 or 3456×2234)", processor: "Apple M1 Pro or M1 Max", storage: "512GB-8TB SSD", memory: "16-64GB unified", battery: "70-100 Wh" }, design: "Notch, ProMotion, HDMI, SD" },
  { name: "MacBook Pro", slug: "macbook-pro-m2-2022", year: 2022, month: 6, model: "M2", specs: { display: "13.3\" Retina or 14.2\"/16.2\" Liquid Retina XDR", processor: "Apple M2 or M2 Pro/Max", storage: "256GB-8TB SSD", memory: "8-96GB unified", battery: "58-100 Wh" }, design: "M2 Pro/Max, M2 13\"" },
  { name: "MacBook Pro", slug: "macbook-pro-m2-pro-max-2023", year: 2023, month: 1, model: "M2 Pro/Max", specs: { display: "14.2\" or 16.2\" Liquid Retina XDR", processor: "Apple M2 Pro or M2 Max", storage: "512GB-8TB SSD", memory: "16-96GB unified", battery: "70-100 Wh" }, design: "Wi-Fi 6E, HDMI 2.1" },
  { name: "MacBook Pro", slug: "macbook-pro-m4-2024", year: 2024, month: 10, model: "M4", specs: { display: "14.2\" or 16.2\" Liquid Retina XDR", processor: "Apple M4, M4 Pro, or M4 Max", storage: "512GB-8TB SSD", memory: "16-128GB unified", battery: "70-100 Wh" }, design: "M4 family, Apple Intelligence" },
  { name: "MacBook 12\"", slug: "macbook-12-2015", year: 2015, month: 4, model: "12\"", specs: { display: "12\" Retina (2304×1440)", processor: "Intel Core M", storage: "256-512GB SSD", memory: "8GB DDR3", battery: "39.7 Wh" }, design: "Fanless, single USB-C" },
  { name: "MacBook 12\"", slug: "macbook-12-2016", year: 2016, month: 4, model: "12\"", specs: { display: "12\" Retina (2304×1440)", processor: "Intel Core m3/m5/m7 (Skylake)", storage: "256-512GB SSD", memory: "8GB DDR3", battery: "41.4 Wh" }, design: "Rose Gold, faster" },
  { name: "MacBook 12\"", slug: "macbook-12-2017", year: 2017, month: 6, model: "12\"", specs: { display: "12\" Retina (2304×1440)", processor: "Intel Core i5/i7 (Kaby Lake)", storage: "256-512GB SSD", memory: "8-16GB DDR3", battery: "41.4 Wh" }, design: "Kaby Lake, final update" },
];

function generateContent(product, type) {
  const s = product.specs;
  const specLines = Object.entries(s).map(([k, v]) => `- **${k.charAt(0).toUpperCase() + k.slice(1)}**: ${v}`).join("\n");
  const modelNote = product.model ? ` (${product.model})` : "";

  let overview, designExpand, conclusion;
  if (type === "iphone") {
    overview = `The ${product.name} marked another step in Apple's smartphone evolution when it launched in ${product.year}. Building on the foundation of its predecessors, it delivered meaningful improvements in performance, display quality, and camera capabilities. The device quickly became a popular choice for users seeking a balance of features and value.

Apple has consistently refined the iPhone formula with each generation, and the ${product.name} was no exception. From the display to the chipset, every component was chosen to deliver a cohesive user experience. The ${product.name} found its place among consumers who wanted a reliable, well-supported device with access to the full iOS ecosystem. Whether for photography, productivity, or entertainment, the ${product.name} offered a versatile platform that adapted to a wide range of user needs.`;
    designExpand = `${product.design}. The build quality reflected Apple's attention to detail, with materials and finishes that felt premium in hand. Ergonomics were carefully considered to ensure comfortable one-handed use where applicable. Weight distribution and button placement contributed to an intuitive, satisfying user experience.`;
    const isRecent = product.year >= 2022;
    conclusion = isRecent
      ? `The ${product.name} remains a strong choice in the iPhone lineup. Its combination of display quality and processing power delivers excellent performance for everyday use, photography, and demanding apps. With ongoing iOS support, it will receive updates for years to come.`
      : `The ${product.name} remains a notable entry in iPhone history. Its combination of display quality and processing power made it a compelling option at release. For collectors or those on a budget, it can still handle basic tasks like messaging, browsing, and light apps, though software support has likely ended for older models. If you're considering a used ${product.name}, battery health and storage capacity are the main factors to evaluate.`;
  } else {
    overview = `The ${product.name}${modelNote} from ${product.year} represented Apple's vision for portable computing at the time. Whether targeting professionals or everyday users, it offered a refined balance of performance, portability, and build quality that defined the MacBook lineup.

This model continued the tradition of combining powerful internals with a sleek, durable chassis. Users could expect reliable performance for productivity tasks, creative work, and everyday computing. The ${product.name} lineup has always prioritized the balance between power and portability. From coding and video editing to web browsing and document work, this machine was built to handle diverse workloads.`;
    designExpand = `${product.design}. The keyboard and trackpad were designed for long typing sessions, and the overall footprint made it easy to carry in a bag. Apple's unibody construction ensured durability and a consistent, premium feel. Port selection and thermal management were engineered to support real-world usage patterns.`;
    const isAppleSilicon = product.year >= 2020 && (product.slug.includes("m1") || product.slug.includes("m2") || product.slug.includes("m3") || product.slug.includes("m4"));
    conclusion = isAppleSilicon
      ? `The ${product.name}${modelNote} from ${product.year} delivers excellent performance thanks to Apple Silicon. Its efficiency and battery life set new standards for portable computing. It remains a highly capable machine for professional and everyday use, with strong software support.`
      : `The ${product.name}${modelNote} from ${product.year} delivered solid performance for its era. Its display and processor were well-suited to the workflows of the day. While newer models with Apple Silicon have since surpassed it in efficiency and speed, it remains a capable machine for light to moderate use. For those considering a used model, check battery cycle count and ensure the SSD is in good health.`;
  }

  return `## Overview

${overview}

## Key Specifications

The ${product.name}${type === "macbook" ? ` ${product.model || ""}` : ""} delivered the following hardware:

${specLines}

These specifications positioned the device competitively within its segment at the time of release. The combination of hardware choices reflected Apple's focus on delivering a balanced, user-centric experience rather than chasing raw numbers.

## Design

${designExpand}

## Conclusion

${conclusion}
`;
}

function generateMarkdown(product, type) {
  const pubDate = `${product.year}-${String(product.month).padStart(2, "0")}-01`;
  const title = type === "iphone" ? `${product.name} Review & Specs (${product.year})` : `${product.name} ${product.model || ""} Review & Specs (${product.year})`.trim();
  const description = type === "iphone"
    ? `Complete review and specifications of the ${product.name}. Display: ${product.specs.display}. Processor: ${product.specs.processor}. Camera: ${product.specs.camera}.`
    : `Complete review and specifications of the ${product.name} ${product.year}. ${product.specs.display}. ${product.specs.processor}.`;
  const keywords = [product.name, `${product.name} specs`, `${product.name} ${product.year}`, "Apple"];
  const content = generateContent(product, type);

  return `---
title: "${title}"
description: "${description}"
keywords: ${JSON.stringify(keywords)}
pubDate: "${pubDate}"
author: "apple-editor"
---

${content}
`;
}

function main() {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  let count = 0;
  for (const iphone of iPhones) {
    const md = generateMarkdown(iphone, "iphone");
    const path = join(outputDir, `${iphone.slug}.md`);
    writeFileSync(path, md, "utf-8");
    count++;
    console.log(`Created: ${iphone.slug}.md`);
  }

  for (const mac of macBooks) {
    const md = generateMarkdown(mac, "macbook");
    const path = join(outputDir, `${mac.slug}.md`);
    writeFileSync(path, md, "utf-8");
    count++;
    console.log(`Created: ${mac.slug}.md`);
  }

  console.log(`\nDone. Generated ${count} markdown files in sites/apple/posts/`);
}

main();
