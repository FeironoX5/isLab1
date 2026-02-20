import {Validators} from '@angular/forms';
import {OperationConfig, TableConfig} from './models';
import {formatEnumValue} from './utils';

export const tables: TableConfig[] = [
  {
    title: 'Dragons',
    entityUrl: '/dragons',
    displayFormatter: (e: any) =>
      `${e.name} (#${e.id}), ${formatEnumValue(e.character)}${e.type ? `, ${formatEnumValue(e.type)}` : ''}`,
    columns: [
      {propertyName: 'id', displayName: '#', sortable: true, type: 'auto'},
      {propertyName: 'name', displayName: 'Name', sortable: true, type: 'input', dataType: 'string', validators: [Validators.required]},
      {propertyName: 'age', displayName: 'Age', sortable: true, type: 'input', dataType: 'number', validators: [Validators.min(0)]},
      {propertyName: 'color', displayName: 'Color', sortable: true, type: 'enum', enumValues: ['RED', 'BLUE', 'YELLOW', 'ORANGE'], validators: []},
      {propertyName: 'type', displayName: 'Type', sortable: true, type: 'enum', enumValues: ['WATER', 'UNDERGROUND', 'AIR', 'FIRE'], validators: []},
      {propertyName: 'character', displayName: 'Character', sortable: true, type: 'enum', enumValues: ['EVIL', 'CHAOTIC_EVIL', 'FICKLE'], validators: [Validators.required]},
      {propertyName: 'coordinatesId', displayName: 'Coordinates', sortable: false, type: 'selectable', tableIndexToSelectFrom: 4, validators: [Validators.required]},
      {propertyName: 'caveId', displayName: 'Cave', sortable: false, type: 'selectable', tableIndexToSelectFrom: 2, validators: []},
      {propertyName: 'killerId', displayName: 'Killer', sortable: false, type: 'selectable', tableIndexToSelectFrom: 1, validators: []},
      {propertyName: 'headId', displayName: 'Head', sortable: false, type: 'selectable', tableIndexToSelectFrom: 3, validators: []},
    ]
  },
  {
    title: 'People',
    entityUrl: '/people',
    displayFormatter: (e: any) => `${e.name} (#${e.id})`,
    columns: [
      {propertyName: 'id', displayName: '#', sortable: true, type: 'auto'},
      {propertyName: 'name', displayName: 'Name', sortable: true, type: 'input', dataType: 'string', validators: [Validators.required]},
      {propertyName: 'eyeColor', displayName: 'Eye color', sortable: true, type: 'enum', enumValues: ['RED', 'BLUE', 'YELLOW', 'ORANGE'], validators: []},
      {propertyName: 'hairColor', displayName: 'Hair color', sortable: true, type: 'enum', enumValues: ['RED', 'BLUE', 'YELLOW', 'ORANGE'], validators: [Validators.required]},
      {propertyName: 'locationId', displayName: 'Location', sortable: false, type: 'selectable', tableIndexToSelectFrom: 5, validators: []},
      {propertyName: 'birthday', displayName: 'Birthday', sortable: true, type: 'input', dataType: 'string', validators: []},
      {propertyName: 'height', displayName: 'Height', sortable: true, type: 'input', dataType: 'number', validators: [Validators.required, Validators.min(0)]},
      {propertyName: 'weight', displayName: 'Weight', sortable: true, type: 'input', dataType: 'number', validators: [Validators.min(0)]},
      {propertyName: 'passportId', displayName: 'Passport ID', sortable: true, type: 'input', dataType: 'string', validators: [Validators.required]},
    ]
  },
  {
    title: 'Dragon Caves',
    entityUrl: '/dragon-caves',
    displayFormatter: (e: any) => `Cave #${e.id}, depth ${e.depth}`,
    columns: [
      {propertyName: 'id', displayName: '#', sortable: true, type: 'auto'},
      {propertyName: 'depth', displayName: 'Depth', sortable: true, type: 'input', dataType: 'number', validators: [Validators.required]}
    ]
  },
  {
    title: 'Dragon Heads',
    entityUrl: '/dragon-heads',
    displayFormatter: (e: any) => `Head #${e.id}, size ${e.size ?? '-'}`,
    columns: [
      {propertyName: 'id', displayName: '#', sortable: true, type: 'auto'},
      {propertyName: 'size', displayName: 'Size', sortable: true, type: 'input', dataType: 'number', validators: []}
    ]
  },
  {
    title: 'Coordinates',
    entityUrl: '/coordinates',
    displayFormatter: (e: any) => `#${e.id}: (${e.x}, ${e.y})`,
    columns: [
      {propertyName: 'id', displayName: '#', sortable: true, type: 'auto'},
      {propertyName: 'x', displayName: 'X', sortable: true, type: 'input', dataType: 'number', validators: [Validators.required, Validators.min(-998)]},
      {propertyName: 'y', displayName: 'Y', sortable: true, type: 'input', dataType: 'number', validators: [Validators.required, Validators.max(844)]}
    ]
  },
  {
    title: 'Locations',
    entityUrl: '/locations',
    displayFormatter: (e: any) => `${e.name} (#${e.id})`,
    columns: [
      {propertyName: 'id', displayName: '#', sortable: true, type: 'auto'},
      {propertyName: 'x', displayName: 'X', sortable: true, type: 'input', dataType: 'number', validators: [Validators.required]},
      {propertyName: 'y', displayName: 'Y', sortable: true, type: 'input', dataType: 'number', validators: []},
      {propertyName: 'z', displayName: 'Z', sortable: true, type: 'input', dataType: 'number', validators: [Validators.required]},
      {propertyName: 'name', displayName: 'Name', sortable: true, type: 'input', dataType: 'string', validators: [Validators.required]}
    ]
  },
  {
    title: 'Admin Requests',
    entityUrl: '/admin-requests',
    displayFormatter: (e: any) => `Request #${e.id} ${e.status}`,
    columns: [
      {propertyName: 'id', displayName: '#', sortable: true, type: 'auto'},
      {propertyName: 'status', displayName: 'Status', sortable: true, type: 'enum', enumValues: ['PENDING', 'APPROVED', 'REJECTED'], validators: []},
      {propertyName: 'createdAt', displayName: 'Created at', sortable: true, type: 'auto', dataType: 'date'},
      {propertyName: 'approvalDate', displayName: 'Approval date', sortable: true, type: 'auto', dataType: 'date'}
    ],
    readOnly: true
  },
  {
    title: 'Batch Import History',
    entityUrl: '/batch-import/history',
    displayFormatter: (e: any) => `Import #${e.id} ${e.status}`,
    columns: [
      {propertyName: 'id', displayName: '#', sortable: true, type: 'auto'},
      {propertyName: 'status', displayName: 'Status', sortable: true, type: 'auto'},
      {propertyName: 'successfulOperations', displayName: 'Successful ops', sortable: true, type: 'auto'},
      {propertyName: 'filePath', displayName: 'File path', sortable: false, type: 'auto'},
      {propertyName: 'createdAt', displayName: 'Created at', sortable: true, type: 'auto', dataType: 'date'}
    ],
    readOnly: true
  }
];

export const operations: OperationConfig[] = [
  {
    title: 'Средний возраст драконов',
    description: 'Возвращает средний возраст всех драконов.',
    path: '/special-operations/average-age',
    method: 'GET',
    params: []
  },
  {
    title: 'Дракон из самой глубокой пещеры',
    description: 'Возвращает дракона, живущего в самой глубокой пещере.',
    path: '/special-operations/deepest-cave-dragon',
    method: 'GET',
    params: []
  },
];
