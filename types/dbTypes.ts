export interface DatabaseConfig {
  dialect: "sqlite";
  storage: string;
  logging: boolean;
  define: {
    underscored: boolean;
    freezeTableName: boolean;
    timestamps: boolean;
  };
}
