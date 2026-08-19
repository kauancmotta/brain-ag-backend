export class DashboardResponseDto {
  totalEntities!: number;
  totalArea!: number;

  byState!: {
    state: string;
    total: number;
  }[];

  byCrop!: {
    crop: string;
    totalArea: number;
  }[];

  landUse!: {
    agriculture: number;
    vegetation: number;
  };
}
