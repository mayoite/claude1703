const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../lib/catalog.ts');

let content = fs.readFileSync(catalogPath, 'utf-8');

// We will use a regex to replace the entire "products" array for "task-chairs" or we can parse it by stripping the export.
// Actually, regex might be brittle. Let's do a simple string replacement on the entire `myel` block.

const newMyel = `{
                        "id": "myel",
                        "name": "Myel",
                        "description": "Experience premium design and unparalleled ergonomic support with the Myel task chair.",
                        "flagshipImage": "https://cdn.prod.website-files.com/686d3b55385e7b905b01d3a5/68a5ea1e27650a56b2eca017_MYEL.jpg",
                        "sceneImages": [
                            "https://cdn.prod.website-files.com/686d3b55385e7b905b01d3a5/68a5ea1e27650a56b2eca017_MYEL.jpg",
                            "https://cdn.prod.website-files.com/686a3867246b0b1dfb03aa5d/68ab123568df8ff6e8c477d0_img-product-detail.png",
                            "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1200",
                            "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1200"
                        ],
                        "variants": [
                            {
                                "id": "standard",
                                "variantName": "Standard Configuration",
                                "galleryImages": [
                                    "https://cdn.prod.website-files.com/686d3b55385e7b905b01d3a5/68a5ea1e27650a56b2eca017_MYEL.jpg",
                                    "https://cdn.prod.website-files.com/686a3867246b0b1dfb03aa5d/68ab123568df8ff6e8c477d0_img-product-detail.png"
                                ]
                            },
                            {
                                "id": "premium-mesh",
                                "variantName": "Premium Mesh with Headrest",
                                "galleryImages": [
                                    "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1200",
                                    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1200"
                                ]
                            }
                        ],
                        "detailedInfo": {
                            "overview": "Myel Excellence represents the perfect fusion of unparalleled comfort and superior craftsmanship. Meticulously designed for extended workflow, it offers an immersive ergonomic experience with continuous dynamic body-tracking support.",
                            "features": [
                                "Synchronized tilt mechanism with 4 locking positions",
                                "Premium Korean elastomeric breathable mesh",
                                "4D adjustable armrests (Height, Width, Depth, Pivot)",
                                "Dynamic auto-adjusting lumbar support system",
                                "BIFMA and Greenguard Gold Certified"
                            ],
                            "dimensions": "Overall Width: 680mm | Overall Depth: 640mm | Height: 1000-1100mm | Seat Height: 450-550mm",
                            "materials": [
                                "Glass-filled nylon frame construction",
                                "High-tensile premium mesh back",
                                "Polished aluminum 5-star base",
                                "High-density molded foam seat cushion"
                            ]
                        }
                    }`;

const newFlip = `{
                        "id": "flip",
                        "name": "Flip",
                        "description": "Agile, minimalist, and perfectly proportioned. The Flip chair adapts to you.",
                        "flagshipImage": "https://cdn.prod.website-files.com/686d3b55385e7b905b01d3a5/6899a8d08871a2e0d561e8c1_image%20(2).png",
                        "sceneImages": [
                            "https://cdn.prod.website-files.com/686d3b55385e7b905b01d3a5/6899a8d08871a2e0d561e8c1_image%20(2).png",
                            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200",
                            "https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=1200"
                        ],
                        "variants": [
                            {
                                "id": "standard",
                                "variantName": "Standard Configuration",
                                "galleryImages": [
                                    "https://cdn.prod.website-files.com/686d3b55385e7b905b01d3a5/6899a8d08871a2e0d561e8c1_image%20(2).png",
                                    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200"
                                ]
                            }
                        ],
                        "detailedInfo": {
                            "overview": "Flip Training Chairs feature a breathable mesh back and cushioned seat for cool, long lasting comfort. The minimalist architectural design supports proper posture, boosting focus during intense collaborative sessions.",
                            "features": [
                                "Weight-activated integrated tilt",
                                "Flexible backrest geometry",
                                "Breathable suspension mesh",
                                "Recycled content construction"
                            ],
                            "dimensions": "Overall Width: 650mm | Seat Depth: 480mm | Total Height: 980mm",
                            "materials": [
                                "Recycled polymer shell",
                                "Torsion spring mechanism",
                                "Precision molded casters"
                            ]
                        }
                    }`;

const newSway = `{
                        "id": "sway",
                        "name": "Sway",
                        "description": "Fluid movement and bold aesthetics defining the modern workspace.",
                        "flagshipImage": "https://cdn.prod.website-files.com/686d3b55385e7b905b01d3a5/68a5eab3fd8ab056401d2236_SWAY.jpg",
                        "sceneImages": [
                            "https://cdn.prod.website-files.com/686d3b55385e7b905b01d3a5/68a5eab3fd8ab056401d2236_SWAY.jpg",
                            "https://images.unsplash.com/photo-1542442828-287217bfb65a?auto=format&fit=crop&q=80&w=1200",
                            "https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&q=80&w=1200",
                            "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=1200"
                        ],
                        "variants": [
                            {
                                "id": "standard",
                                "variantName": "Standard Configuration",
                                "galleryImages": [
                                    "https://cdn.prod.website-files.com/686d3b55385e7b905b01d3a5/68a5eab3fd8ab056401d2236_SWAY.jpg",
                                    "https://images.unsplash.com/photo-1542442828-287217bfb65a?auto=format&fit=crop&q=80&w=1200"
                                ]
                            }
                        ],
                        "detailedInfo": {
                            "overview": "Sway is crafted for those who thrive on fluidity and focus. Its agile design empowers seamless transitions between tasks, offering dependable ease and elegant responsiveness. More than just a chair—it’s a rhythm partner for your workday.",
                            "features": [
                                "Responsive kinetic suspension",
                                "Harmonic tilt calibration",
                                "Wrap-around supportive shell",
                                "Integrated task arms"
                            ],
                            "dimensions": "Overall Width: 700mm | Back Height: 1020mm | Seat Height: 440-540mm",
                            "materials": [
                                "Architectural grade aluminum",
                                "Injection molded elastomeric polymer",
                                "Eco-friendly fabric upholstery"
                            ]
                        }
                    }`;

// Regex to replace the specific objects
content = content.replace(/{[\s\S]*?"id":\s*"myel",[\s\S]*?}\n\s+\}/, newMyel);
content = content.replace(/{[\s\S]*?"id":\s*"flip",[\s\S]*?}\n\s+\}/, newFlip);
content = content.replace(/{[\s\S]*?"id":\s*"sway",[\s\S]*?}\n\s+\}/, newSway);

fs.writeFileSync(catalogPath, content, 'utf-8');
console.log('Catalog updated successfully.');
