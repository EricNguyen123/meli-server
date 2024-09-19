import { envs } from 'src/config/envs';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'mysql',
  host: envs.host,
  port: envs.dbport,
  username: envs.user,
  password: envs.password,
  database: envs.database,
  entities: ['dist/**/*.entity.{js, ts}'],
  migrations: ['dist/databases/migrations/*.js'],
  migrationsTableName: 'custom_migration_table',
});

export default dataSource;
