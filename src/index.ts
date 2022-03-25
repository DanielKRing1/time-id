const addToJson = (modelObject) => {
    if(!modelObject) return;

    const modelObjectJSON = { ...modelObject };
    modelObject.toJSON = () => modelObjectJSON;

    return modelObject;
}

// https://github.com/realm/realm-js/issues/370#issuecomment-270849466
export default class Realm {
    schema: any;
    schemaVersion: number;

    callbackList: any[];
    data: any;
    schemaCallbackList: any;
    lastLookedUpModel: any;
    isClosed: boolean = false;

    compareFunc: any;
    filtered: any;
    writing: any;

    static open (params) {
        return new Promise((resolve) => {
            resolve(new Realm(params));
        });
    }

    constructor(params) {
      this.schema = {};
        this.schemaVersion = params.schemaVersion || 0;

      this.callbackList = [];
      this.data = {};
      this.schemaCallbackList = {};
      params.schema.forEach((schema) => {
        this.data[schema.name] = {};
      });
      params.schema.forEach((schema) => {
        this.schema[schema.name] = schema;
      });
      this.lastLookedUpModel = null;
    }

    close(): void {
      this.isClosed = true;
    };
  
    objects(schemaName) {
      this.lastLookedUpModel = schemaName;
      const objects: any = Object.values(this.data[schemaName]).map((modelObject: any) => addToJson(modelObject));
      objects.values = () => objects;
      objects.sorted = () => this.compareFunc ? objects.sort(this.compareFunc) : objects.sort();
      objects.addListener = (cb) => {
        if (this.schemaCallbackList[schemaName]) {
          this.schemaCallbackList[schemaName].push(cb);
        } else {
          this.schemaCallbackList[schemaName] = [cb];
        }
      };
      objects.removeListener = () => {};
      objects.filtered = this.filtered ? this.filtered.bind(this, schemaName) : () => objects;
      return objects;
    }
  
    write(fn) {
      if(this.writing) throw new Error(`Realm is alrady writing! Cannot execute function ${JSON.stringify(fn)}`);

      this.writing = true;
      try {
        fn();
      }finally {
        this.writing = false;
      }
    }
  
    create(schemaName, object) {
      const modelObject = object;
    //   1. Get properties from defined schema
      const properties = this.schema[schemaName].properties;
      Object.keys(properties).forEach((propKey) => {
        //   2.1. Recursivley create object row
        if (modelObject[propKey] && modelObject[propKey].model) {
              this.data[modelObject[propKey].model][modelObject[propKey].id] = this.create(
            modelObject[propKey].model, modelObject[propKey],
          );
        }
        //   2.2. Create object row for list
        else if (modelObject[propKey] && modelObject[propKey].length && modelObject[propKey][0].model) {
              modelObject[propKey].forEach((obj) => {
            this.data[modelObject[propKey][0].model][obj.id] = obj;
          });
          modelObject[propKey].filtered = this.filtered ? this.filtered : () => modelObject[propKey];
          modelObject[propKey].sorted = () => modelObject[propKey].sort();
        } else if (modelObject[propKey] === undefined) {
          if (typeof properties[propKey] === 'object' && properties[propKey].optional) {
            modelObject[propKey] = null;
          }
          if (typeof properties[propKey] === 'object' && ['list', 'linkingObjects'].includes(properties[propKey].type)) {
            modelObject[propKey] = [];
            modelObject[propKey].filtered = () => [];
            modelObject[propKey].sorted = () => [];
          }
        }
      });

      const idPropKey = this.schema[schemaName].primaryKey;
      const idKey = modelObject[idPropKey];
      this.data[schemaName][idKey] = modelObject;
      // console.log(idKey)
      // console.log(modelObject)
      // console.log(this.data)
      // console.log(this.data[schemaName])
      // console.log(this.data[schemaName][idKey])
      if (this.writing) {
        if (this.schemaCallbackList[schemaName]) {
          this.schemaCallbackList[schemaName].forEach(cb => cb(schemaName, {
            insertions: { length: 1 },
            modifications: { length: 0 },
            deletions: { length: 0 },
          }));
        }
        this.callbackList.forEach((cb) => { cb(); });
      }
        
      return addToJson(modelObject);
    }
  
    objectForPrimaryKey(model, id) {
      this.lastLookedUpModel = model;
      const modelObject = this.data[model][id];

      return addToJson(modelObject);
    }
  
    delete(object) {
      if (this.lastLookedUpModel || object.model) {
        const model = object.model ? object.model : this.lastLookedUpModel
        if (Array.isArray(object)) {
          object.forEach((item) => {
            delete this.data[model][item.id];
          });
        }
        delete this.data[model][object.id];
        if (this.writing) {
          if (this.schemaCallbackList[model]) {
            this.schemaCallbackList[model].forEach(cb => cb(model, {
              insertions: { length: 0 },
              modifications: { length: 0 },
              deletions: { length: 1 },
            }));
          }
          this.callbackList.forEach((cb) => { cb(); });
        }
      }
    }
  
    deleteAll() {
      Object.keys(this.schema).forEach((key) => {
        if (this.writing && this.schemaCallbackList[this.schema[key].name]) {
          this.schemaCallbackList[this.schema[key].name].forEach(cb => cb(key, {
            insertions: { length: 0 },
            modifications: { length: 0 },
            deletions: { length: Object.values(this.data[this.schema[key].name]).length },
          }));
        }
        this.data[this.schema[key].name] = {};
      });
      if (this.writing) this.callbackList.forEach((cb) => { cb(); });
    }
  
    addListener(event, callback) {
      this.callbackList.push(callback);
    }
  
    prepareData(schemaName, objects) {
      objects.forEach((object) => {
        this.create(schemaName, object);
      });
    }
  }

  
//   Realm.Object = class Object {
//     isValid() { return true; }
//   };

// // TYPES

// import { Dict } from "../src";
// import { LOADABLE_SCHEMA_TABLE_NAME } from "../src/Schemas";

// type Schema = {
//     name: string;
//     primaryKey?: string;
//     properties: Dict<any>;
// };

// // REALM MOCK CLASS

// export default class Realm {
//     schema: Schema[] = [];
//     path: string;
//     schemaVersion: number;

//     data: Dict<any[]> = {};

//     // Init
//     static open(params: { schema: Schema[]; path: string; schemaVersion: number }): Realm {
//         const realm: Realm = new Realm(params);

//         return realm;
//     }

//     close(): void {};

//     constructor(params: { schema: Schema[]; path: string; schemaVersion: number }) {
//         this.schema = params.schema;
//         params.schema.forEach((schema: Schema) => (this.data[schema.name] = []));

//         this.path = params.path;
//         this.schemaVersion = params.schemaVersion || 0;
//     }

//     // Read
//     objects(schemaName: string): any[] {
//         return this.data[schemaName];
//     }
//     objectForPrimaryKey(schemaName: string, primaryKey: string): any {
//         // 1. Get Schema, to read primaryKey
//         const schemaToSearch: Schema = this.schema.find((schema: Schema) => schema.name === schemaName);
//         if (!schemaToSearch) return;

//         // Get pk
//         const { primaryKey: key } = schemaToSearch;
//         // 2. Get row with matching pk
//         return this.data[schemaName].find((row: any) => row[key] === primaryKey);
//     }

//     // Write
//     write(fn: () => void): void {
//         fn();
//     }

//     create(schemaName: string, row: any): any {
//         // 1. Get Schema, to read primaryKey
//         const schemaToSearch: Schema = this.schema.find((schema: Schema) => schema.name === schemaName);
//         if (!schemaToSearch) return;

//         // 2. Prevent duplicate pk
//         const { primaryKey } = schemaToSearch;
//         const isDuplicate: boolean = !!primaryKey && !!this.data[schemaName].find((existingRow: any) => row[primaryKey] === existingRow[primaryKey]);

//         // 3. Add new row
//         if (!isDuplicate) this.data[schemaName].push(row);

//         return !isDuplicate ? row : undefined;
//     }

//     // delete(schema: Realm.ObjectSchema) {
//     //     const index: number = this.schema.findIndex((s: Realm.ObjectSchema) => s.name === schema.name);
//     //     if (index > -1) this.schema.splice(index, 1);
//     // }

//     delete(schema: Realm.ObjectSchema) {
//         const loadableSchemaTable = this.data[LOADABLE_SCHEMA_TABLE_NAME];

//         const indexToDelete: number = loadableSchemaTable.findIndex((s: Realm.ObjectSchema) => s.name === schema.name);

//         if (indexToDelete > -1) this.data[LOADABLE_SCHEMA_TABLE_NAME].splice(indexToDelete, 1);
//     }
// }
