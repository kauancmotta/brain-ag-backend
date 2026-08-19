import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { UpdateCropSeasonDto } from '../crop_seasons/dto/update-crop_season.dto';
import { CreateCropSeasonDto } from '../crop_seasons/dto/create-crop_season.dto';
import { UpdateCropSeasonCropDto } from '../crop_season_crops/dto/update-crop_season_crop.dto';
import { CreateCropSeasonCropDto } from '../crop_season_crops/dto/create-crop_season_crop.dto';

@ApiTags('Entities')
@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an entity' })
  @ApiBody({ type: CreateEntityDto })
  create(@Body() createEntityDto: CreateEntityDto) {
    return this.entitiesService.create(createEntityDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all entities' })
  findAll() {
    return this.entitiesService.findAll();
  }

  @Get(':entityId/crop-seasons')
  @ApiOperation({ summary: 'List crop seasons for an entity' })
  @ApiParam({ name: 'entityId', type: String })
  findCropSeasons(@Param('entityId', ParseUUIDPipe) entityId: string) {
    return this.entitiesService.findCropSeasons(entityId);
  }

  @Post(':entityId/crop-seasons')
  @ApiOperation({ summary: 'Create a crop season for an entity' })
  @ApiParam({ name: 'entityId', type: String })
  @ApiBody({ type: CreateCropSeasonDto })
  createCropSeason(
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Body() createDto: CreateCropSeasonDto,
  ) {
    return this.entitiesService.createCropSeason(entityId, createDto);
  }

  @Get(':entityId/crop-seasons/:cropSeasonId')
  @ApiOperation({ summary: 'Get a crop season for an entity' })
  @ApiParam({ name: 'entityId', type: String })
  @ApiParam({ name: 'cropSeasonId', type: String })
  findCropSeason(
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Param('cropSeasonId', ParseUUIDPipe) cropSeasonId: string,
  ) {
    return this.entitiesService.findCropSeason(entityId, cropSeasonId);
  }

  @Patch(':entityId/crop-seasons/:cropSeasonId')
  @ApiOperation({ summary: 'Update a crop season for an entity' })
  @ApiParam({ name: 'entityId', type: String })
  @ApiParam({ name: 'cropSeasonId', type: String })
  @ApiBody({ type: UpdateCropSeasonDto })
  updateCropSeason(
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Param('cropSeasonId', ParseUUIDPipe) cropSeasonId: string,
    @Body() updateCropSeasonDto: UpdateCropSeasonDto,
  ) {
    return this.entitiesService.updateCropSeason(
      entityId,
      cropSeasonId,
      updateCropSeasonDto,
    );
  }

  @Put(':entityId/crop-seasons/:cropSeasonId')
  @ApiOperation({ summary: 'Replace a crop season for an entity' })
  @ApiParam({ name: 'entityId', type: String })
  @ApiParam({ name: 'cropSeasonId', type: String })
  @ApiBody({ type: UpdateCropSeasonDto })
  replaceCropSeason(
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Param('cropSeasonId', ParseUUIDPipe) cropSeasonId: string,
    @Body() updateDto: UpdateCropSeasonDto,
  ) {
    return this.entitiesService.updateCropSeason(
      entityId,
      cropSeasonId,
      updateDto,
    );
  }

  @Post(':entityId/crop-seasons/:cropSeasonId/crop-season-crops')
  @ApiOperation({ summary: 'Add a planted crop to an entity crop season' })
  @ApiParam({ name: 'entityId', type: String })
  @ApiParam({ name: 'cropSeasonId', type: String })
  @ApiBody({ type: CreateCropSeasonCropDto })
  createCropSeasonCrop(
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Param('cropSeasonId', ParseUUIDPipe) cropSeasonId: string,
    @Body() createDto: CreateCropSeasonCropDto,
  ) {
    return this.entitiesService.createCropSeasonCrop(
      entityId,
      cropSeasonId,
      createDto,
    );
  }

  @Get(
    ':entityId/crop-seasons/:cropSeasonId/crop-season-crops/:cropSeasonCropId',
  )
  @ApiOperation({ summary: 'Get a planted crop for an entity crop season' })
  @ApiParam({ name: 'entityId', type: String })
  @ApiParam({ name: 'cropSeasonId', type: String })
  @ApiParam({ name: 'cropSeasonCropId', type: String })
  findCropSeasonCrop(
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Param('cropSeasonId', ParseUUIDPipe) cropSeasonId: string,
    @Param('cropSeasonCropId', ParseUUIDPipe) cropSeasonCropId: string,
  ) {
    return this.entitiesService.findCropSeasonCrop(
      entityId,
      cropSeasonId,
      cropSeasonCropId,
    );
  }

  @Put(
    ':entityId/crop-seasons/:cropSeasonId/crop-season-crops/:cropSeasonCropId',
  )
  @ApiOperation({ summary: 'Update a planted crop for an entity crop season' })
  @ApiParam({ name: 'entityId', type: String })
  @ApiParam({ name: 'cropSeasonId', type: String })
  @ApiParam({ name: 'cropSeasonCropId', type: String })
  @ApiBody({ type: UpdateCropSeasonCropDto })
  updateCropSeasonCrop(
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Param('cropSeasonId', ParseUUIDPipe) cropSeasonId: string,
    @Param('cropSeasonCropId', ParseUUIDPipe) cropSeasonCropId: string,
    @Body() updateDto: UpdateCropSeasonCropDto,
  ) {
    return this.entitiesService.updateCropSeasonCrop(
      entityId,
      cropSeasonId,
      cropSeasonCropId,
      updateDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.entitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateEntityDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEntityDto: UpdateEntityDto,
  ) {
    return this.entitiesService.update(id, updateEntityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an entity' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.entitiesService.remove(id);
  }
}
