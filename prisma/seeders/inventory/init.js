import products from "./products.json" with { type: "json" };
import stockTransactions from "./stock-transactions.json" with { type: "json" };
import stockOpnames from "./stock-opnames.json" with { type: "json" };


async function seedProducts(prisma) {
    console.log("Seeding products...");

    for (const product of products.products) {

        const newProduct = await prisma.product.create({
            data: {
                name: product.name,
                sku: product.sku,
                price: product.price,
                stock: product.stock,
                category_id: product.category_id,
                unit_id: product.unit_id
            }
        });


        if (product.locations?.length) {

            for (const location of product.locations) {

                await prisma.productLocation.create({
                    data: {
                        code: location.code,
                        name: location.name,
                        notes: location.notes,
                        product_id: newProduct.id,
                        warehouse_id: location.warehouse_id,
                        location_id: location.location_id,
                        rack_id: location.rack_id
                    }
                });

            }
        }
    }

    console.log("Products seeded");
}


async function seedStockTransactions(prisma) {
    console.log("Seeding stock transactions...");

    for (const transaction of stockTransactions.transactions) {

        const stock = await prisma.stockTransaction.create({
            data: {
                transaction_type: transaction.transaction_type,
                reference_no: transaction.reference_no,
                source: transaction.source,
                receiver: transaction.receiver,
                contact_person: transaction.contact_person,
                phone: transaction.phone,
                note: transaction.note,
                warehouse_id: transaction.warehouse_id,
                grand_total: transaction.grand_total
            }
        });


        if (transaction.products?.length) {

            for (const product of transaction.products) {

                await prisma.stockTransactionProduct.create({
                    data: {
                        stock_id: stock.id,
                        product_id: product.product_id,
                        unit_id: product.unit_id,
                        qty: product.qty,
                        total: product.total
                    }
                });

            }
        }
    }

    console.log("Stock transactions seeded");
}


async function seedStockOpnames(prisma) {
    console.log("Seeding stock opnames...");

    for (const opname of stockOpnames.opnames) {

        const stockOpname = await prisma.stockOpname.create({
            data: {
                date: new Date(opname.date),
                title: opname.title,
                warehouse_id: opname.warehouse_id,
                qty: opname.qty,
                checked_goods: opname.checked_goods,
                precentage: opname.precentage,
                note: opname.note,
                fileName: opname.fileName,
                filePath: opname.filePath,
                employee_id: opname.employee_id
            }
        });


        if (opname.locations?.length) {

            for (const location of opname.locations) {

                await prisma.stockOpnameLocation.create({
                    data: {
                        stock_opname_id: stockOpname.id,
                        product_id: location.product_id,
                        qty: location.qty,
                        note: location.note
                    }
                });

            }
        }
    }

    console.log("Stock opnames seeded");
}


export default async function inventoryInit(prisma) {

    await seedProducts(prisma);

    await seedStockTransactions(prisma);

    await seedStockOpnames(prisma);

    console.log("All inventory seed completed");
}