import { MongoClient, Collection, InsertOneResult } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect(url: string) {
    this.client = await MongoClient.connect(url);
  },

  async disconnect() {
    await this.client.close();
    this.client = null;
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  map(collectionData: any): any {
    const { _id, ...collection } = collectionData;
    return { id: _id, ...collection };
  },
};
