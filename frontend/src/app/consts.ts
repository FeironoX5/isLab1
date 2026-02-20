import {Validators} from '@angular/forms';
import {OperationConfig, TableConfig} from './models';
import {formatEnumValue} from './utils';

export const tables: TableConfig[] = [
  {
    title: 'Dragons',
    entityUrl: '/dragons',
    displayFormatter: (e: any) =>
      `${e.speaking ? 'Speaking' : 'Silent'} ${e.color.toLowerCase()} dragon ${e.name} (#${e.id}), age ${e.age}`,
    columns: [
      {
        propertyName: 'id',
        displayName: '#',
        sortable: false,
        type: 'auto'
      },
      {
        propertyName: 'name',
        displayName: 'Name',
        sortable: true,
        type: 'input',
        dataType: 'string',
        validators: [Validators.required]
      },
      {
        propertyName: 'creationDate',
        displayName: 'Creation Date',
        sortable: false,
        type: 'auto',
        dataType: 'date'
      },
      {
        propertyName: 'age',
        displayName: 'Age',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: [Validators.required, Validators.min(1)]
      },
      {
        propertyName: 'description',
        displayName: 'Description',
        sortable: true,
        type: 'input',
        dataType: 'string',
        validators: [Validators.required]
      },
      {
        propertyName: 'speaking',
        displayName: 'Speaking',
        sortable: true,
        type: 'input',
        dataType: 'boolean',
        validators: [Validators.required]
      },
      {
        propertyName: 'color',
        displayName: 'Color',
        sortable: true,
        type: 'enum',
        enumValues: ['BLUE', 'WHITE', 'BROWN'],
        validators: []
      },
      {
        propertyName: 'coordinatesId',
        displayName: 'Coordinates',
        sortable: false,
        type: 'selectable',
        tableIndexToSelectFrom: 4,
        validators: [Validators.required]
      },
      {
        propertyName: 'caveId',
        displayName: 'Cave',
        sortable: false,
        type: 'selectable',
        tableIndexToSelectFrom: 2,
        validators: [Validators.required]
      },
      {
        propertyName: 'killerId',
        displayName: 'Killer',
        sortable: false,
        type: 'selectable',
        tableIndexToSelectFrom: 1,
        validators: []
      },
      {
        propertyName: 'headId',
        displayName: 'Head',
        sortable: false,
        type: 'selectable',
        tableIndexToSelectFrom: 3,
        validators: []
      },
    ]
  },
  {
    title: 'Persons',
    entityUrl: '/persons',
    displayFormatter: (e: any) =>
      `${e.name} (#${e.id}) from ${formatEnumValue(e.nationality)} with ${e.hairColor.toLowerCase()} hair and ${e.eyeColor.toLowerCase()} eyes`,
    columns: [
      {
        propertyName: 'id',
        displayName: '#',
        sortable: false,
        type: 'auto'
      },
      {
        propertyName: 'name',
        displayName: 'Name',
        sortable: true,
        type: 'input',
        dataType: 'string',
        validators: [Validators.required]
      },
      {
        propertyName: 'eyeColor',
        displayName: 'Eye Color',
        sortable: true,
        type: 'enum',
        enumValues: ['BLUE', 'WHITE', 'BROWN'],
        validators: [Validators.required]
      },
      {
        propertyName: 'hairColor',
        displayName: 'Hair Color',
        sortable: true,
        type: 'enum',
        enumValues: ['BLUE', 'WHITE', 'BROWN'],
        validators: [Validators.required]
      },
      {
        propertyName: 'locationId',
        displayName: 'Location',
        sortable: false,
        type: 'selectable',
        tableIndexToSelectFrom: 5,
        validators: []
      },
      {
        propertyName: 'weight',
        displayName: 'Weight',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: [Validators.required, Validators.min(0.01)]
      },
      {
        propertyName: 'nationality',
        displayName: 'Nationality',
        sortable: true,
        type: 'enum',
        enumValues: ['INDIA', 'VATICAN', 'THAILAND', 'SOUTH_KOREA', 'NORTH_KOREA'],
        validators: [Validators.required]
      }
    ]
  },
  {
    title: 'Dragon Caves',
    entityUrl: '/caves',
    displayFormatter: (e: any) =>
      `Cave (#${e.id}) ${e.depth} meters deep`,
    columns: [
      {
        propertyName: 'id',
        displayName: '#',
        sortable: false,
        type: 'auto'
      },
      {
        propertyName: 'depth',
        displayName: 'Depth',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: [Validators.required]
      }
    ]
  },
  {
    title: 'Dragon Heads',
    entityUrl: '/heads',
    displayFormatter: (e: any) =>
      `Head (#${e.id}) ${e.size}m with ${e.eyesCount} eyes and ${e.toothCount} teeth`,
    columns: [
      {
        propertyName: 'id',
        displayName: '#',
        sortable: false,
        type: 'auto'
      },
      {
        propertyName: 'size',
        displayName: 'Size',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: []
      },
      {
        propertyName: 'eyesCount',
        displayName: 'Eyes Count',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: [Validators.required]
      },
      {
        propertyName: 'toothCount',
        displayName: 'Tooth Count',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: []
      }
    ]
  },
  {
    title: 'Coordinates',
    entityUrl: '/coordinates',
    displayFormatter: (e: any) =>
      `#${e.id}: (${e.x}, ${e.y})`,
    columns: [
      {
        propertyName: 'id',
        displayName: '#',
        sortable: false,
        type: 'auto'
      },
      {
        propertyName: 'x',
        displayName: 'X',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: [Validators.required]
      },
      {
        propertyName: 'y',
        displayName: 'Y',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: [Validators.required, Validators.min(-920)]
      }
    ]
  },
  {
    title: 'Locations',
    entityUrl: '/locations',
    displayFormatter: (e: any) =>
      `${e.name} (#${e.id}) at (${e.x}, ${e.y}, ${e.z})`,
    columns: [
      {
        propertyName: 'id',
        displayName: '#',
        sortable: false,
        type: 'auto'
      },
      {
        propertyName: 'x',
        displayName: 'X',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: [Validators.required]
      },
      {
        propertyName: 'y',
        displayName: 'Y',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: [Validators.required]
      },
      {
        propertyName: 'z',
        displayName: 'Z',
        sortable: true,
        type: 'input',
        dataType: 'number',
        validators: [Validators.required]
      },
      {
        propertyName: 'name',
        displayName: 'Name',
        sortable: true,
        type: 'input',
        dataType: 'string',
        validators: [Validators.required]
      }
    ]
  }
];
export const operations: OperationConfig[] = [
  {
    title: 'Статистика',
    description: '',
    path: '/operations/stats',
    method: 'GET',
    params: []
  },
  {
    title: 'Меньше, чем description',
    description: 'Вернуть количество объектов, значение поля description которых меньше заданного.',
    path: '/operations/description/less-than',
    method: 'GET',
    params: [
      {
        column: {
          propertyName: 'description',
          displayName: 'Description',
          type: 'input',
          dataType: 'string',
          sortable: false
        }, in: 'query'
      },
    ]
  },
  {
    title: 'Меньше, чем age',
    description: 'Вернуть массив объектов, значение поля age которых меньше заданного.',
    path: '/operations/age/less-than',
    method: 'GET',
    params: [
      {
        column: {
          propertyName: 'age',
          displayName: 'Age',
          type: 'input',
          dataType: 'number',
          sortable: false
        }, in: 'query'
      },
    ],
  },
  {
    title: 'Уникальные цвета',
    description: 'Вернуть массив уникальных значений поля color по всем объектам.',
    path: '/operations/unique-colors',
    method: 'GET',
    params: [],
  },
  {
    title: 'Глубокий дракон',
    description: 'Найти дракона, живущего в самой глубокой пещере.',
    path: '/operations/deepest-dragon',
    method: 'GET',
    params: [],
  },
  {
    title: 'Кара дракона',
    description: 'Убить указанного дракона.',
    path: '/operations/kill/{id}',
    method: 'DELETE',
    params: [
      {
        column: {
          propertyName: 'id',
          displayName: 'Dragon Id',
          type: 'input',
          dataType: 'string',
          sortable: false
        }, in: 'path'
      },
    ]
  },
];
