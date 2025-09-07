
import sequelize from "../config/sequelize";

async function seedVehicles() {
  console.log("Starting insert of 500,000 records...");

  const sql = `INSERT INTO vehicles (
baseuser_id, license_plate, vehicle_model_id, color,
is_active, is_currently_parked, created_at, updated_at,
added_by, dimension_overrides, dimensions_source
)
SELECT
(floor(random() * 10000))::int,
nextval('vehicle_number_seq')::int,
(floor(random() * 1000))::int,
(ARRAY['Red','Blue','Green','Black','White'])[floor(random() * 5)::int + 1],
(random() > 0.5),
(random() > 0.5),
now() - (interval '1 day' * (random() * 365)),
now(),
(floor(random() * 2)::int) + 1,
jsonb_build_object(
'height', round((random() * 2 + 1)::numeric, 2),
'width', round((random() * 2 + 1)::numeric, 2),
'length', round((random() * 5 + 2)::numeric, 2),
'weight', floor(random() * 2000 + 800)::int
),
(floor(random() * 3)::int) + 1
FROM generate_series(1, 500000);`;



  const start = Date.now();
  await sequelize.query(sql);
  const end = Date.now();

  console.log('start       ' ,start,'   end  ' ,end);

  console.log(`Inserted 500,000 records in ${(end - start) / 1000} seconds`);

  await sequelize.close();
}

seedVehicles().catch(err => console.error(err));
