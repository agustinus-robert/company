import categories from "./categories.json" with { type: "json" };
import units from "./units.json" with { type: "json" };
import warehouses from "./warehouses.json" with { type: "json" };
import locations from "./locations.json" with { type: "json" };
import racks from "./racks.json" with { type: "json" };


async function seedCategories(prisma) {
  console.log("Seeding categories...");

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
      },
    });
  }

  console.log("Categories seeded");
}


async function seedUnits(prisma) {
  console.log("Seeding units...");

  for (const unit of units) {
    await prisma.unit.create({
      data: {
        code: unit.code,
        name: unit.name,
      },
    });
  }

  console.log("Units seeded");
}


async function seedWarehouses(prisma) {
  console.log("Seeding warehouses...");

  for (const warehouse of warehouses) {
    await prisma.warehouse.create({
      data: {
        code: warehouse.code,
        name: warehouse.name,
      },
    });
  }

  console.log("Warehouses seeded");
}


async function seedLocations(prisma) {
  console.log("Seeding locations...");

  for (const location of locations) {

    const warehouse = await prisma.warehouse.findUnique({
      where: {
        id: location.warehouse_id,
      },
    });

    if (!warehouse) {
      throw new Error(
        `Warehouse ${location.warehouse_id} not found`
      );
    }

    await prisma.location.create({
      data: {
        code: location.code,
        name: location.name,
        warehouse_id: warehouse.id,
      },
    });
  }

  console.log("Locations seeded");
}


async function seedRacks(prisma) {
  console.log("Seeding racks...");

  for (const rack of racks) {

    const location = await prisma.location.findUnique({
      where: {
        id: rack.location_id,
      },
    });

    if (!location) {
      throw new Error(
        `Location ${rack.location_id} not found`
      );
    }

    await prisma.rack.create({
      data: {
        code: rack.code,
        count_rack: rack.count_rack,
        location_id: location.id,
      },
    });
  }

  console.log("Racks seeded");
}


export default async function masterInit(prisma) {

  await seedCategories(prisma);
  await seedUnits(prisma);

  await seedWarehouses(prisma);
  await seedLocations(prisma);
  await seedRacks(prisma);

  console.log("All warehouse seed completed");
}