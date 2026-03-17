import { Project, SyntaxKind, ArrayLiteralExpression, ObjectLiteralExpression, PropertyAssignment, StringLiteral } from 'ts-morph';
import * as fs from 'fs';

async function main() {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath('lib/catalog.ts');

    const auditFile: any[] = [];

    const oandoCatalogVar = sourceFile.getVariableDeclaration('oandoCatalog');
    if (!oandoCatalogVar) throw new Error("Could not find oandoCatalog");

    const initializer = oandoCatalogVar.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
    const categories = initializer.getElements().filter(e => e.isKind(SyntaxKind.ObjectLiteralExpression)) as ObjectLiteralExpression[];

    for (const cat of categories) {
        const catNameProp = cat.getProperty('category')?.asKind(SyntaxKind.PropertyAssignment) || cat.getProperty('name')?.asKind(SyntaxKind.PropertyAssignment);
        if (!catNameProp) continue;
        const catName = (catNameProp.getInitializerIfKindOrThrow(SyntaxKind.StringLiteral) as StringLiteral).getLiteralValue().toLowerCase();

        const seriesProp = cat.getProperty('series')?.asKind(SyntaxKind.PropertyAssignment);
        if (!seriesProp) continue;

        // check target folder
        let expectedPattern = "";
        if (catName.includes('seating')) expectedPattern = "/seating/";
        else if (catName.includes('tables')) expectedPattern = "/tables/";
        else if (catName.includes('storage')) expectedPattern = "/storage/";
        else if (catName.includes('workstations')) expectedPattern = "/workstations/";
        else continue;

        const seriesArr = seriesProp.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
        for (const ser of seriesArr.getElements()) {
            if (!ser.isKind(SyntaxKind.ObjectLiteralExpression)) continue;
            const productsProp = ser.getProperty('products')?.asKind(SyntaxKind.PropertyAssignment);
            if (!productsProp) continue;
            const productsArr = productsProp.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);

            for (const prod of productsArr.getElements()) {
                if (!prod.isKind(SyntaxKind.ObjectLiteralExpression)) continue;

                const prodNameProp = prod.getProperty('name')?.asKind(SyntaxKind.PropertyAssignment);
                const prodSlugProp = prod.getProperty('id')?.asKind(SyntaxKind.PropertyAssignment);
                const prodName = prodNameProp ? prodNameProp.getInitializerIfKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue() : '';
                const prodSlug = prodSlugProp ? prodSlugProp.getInitializerIfKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue() : '';

                let isMismatch = false;

                const checkMismatched = (img: string) => {
                    if (!img) return false;
                    return !img.includes(expectedPattern);
                };

                const flagshipProp = prod.getProperty('flagshipImage')?.asKind(SyntaxKind.PropertyAssignment);
                if (flagshipProp) {
                    const img = flagshipProp.getInitializerIfKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue();
                    if (checkMismatched(img)) {
                        console.log(`Mismatch: [${catName}] ${prodName} - flagship: ${img}`);
                        flagshipProp.setInitializer('""');
                        isMismatch = true;
                    }
                }

                const sceneProp = prod.getProperty('sceneImages')?.asKind(SyntaxKind.PropertyAssignment);
                if (sceneProp) {
                    const arr = sceneProp.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
                    let sceneMismatch = false;
                    arr.getElements().forEach(e => {
                        if (e.isKind(SyntaxKind.StringLiteral)) {
                            if (checkMismatched(e.getLiteralValue())) {
                                console.log(`Mismatch: [${catName}] ${prodName} - scene: ${e.getLiteralValue()}`);
                                sceneMismatch = true;
                                isMismatch = true;
                            }
                        }
                    });
                    if (sceneMismatch) {
                        sceneProp.setInitializer("[]");
                    }
                }

                const variantsProp = prod.getProperty('variants')?.asKind(SyntaxKind.PropertyAssignment);
                if (variantsProp) {
                    const varArr = variantsProp.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
                    for (const variant of varArr.getElements()) {
                        if (!variant.isKind(SyntaxKind.ObjectLiteralExpression)) continue;
                        const galleryProp = variant.getProperty('galleryImages')?.asKind(SyntaxKind.PropertyAssignment);
                        if (galleryProp) {
                            const arr = galleryProp.getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
                            let galMismatch = false;
                            arr.getElements().forEach(e => {
                                if (e.isKind(SyntaxKind.StringLiteral)) {
                                    if (checkMismatched(e.getLiteralValue())) {
                                        console.log(`Mismatch: [${catName}] ${prodName} - gallery: ${e.getLiteralValue()}`);
                                        galMismatch = true;
                                        isMismatch = true;
                                    }
                                }
                            });
                            if (galMismatch) {
                                galleryProp.setInitializer("[]");
                            }
                        }
                    }
                }

                if (isMismatch) {
                    auditFile.push({
                        name: prodName,
                        category: catName,
                        slug: prodSlug,
                        imagesNeeded: 7,
                        currentImages: []
                    });
                }
            }
        }
    }

    sourceFile.saveSync();
    fs.writeFileSync('scripts/image-audit.json', JSON.stringify(auditFile, null, 2));
    console.log(`Audit complete. Found ${auditFile.length} mismatches. Generated image-audit.json.`);
}

main().catch(console.error);
