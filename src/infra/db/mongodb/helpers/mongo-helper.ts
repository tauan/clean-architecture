import { MongoClient, Collection, InsertOneResult } from "mongodb";

export const MongoHelper = {
  client: null as MongoClient,
  async connect(url: string) {
    this.client = await MongoClient.connect(process.env.MONGO_URL);
  },
  async disconnect() {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  map(collection: InsertOneResult<Document>, collectionData: any): any {
    return { id: `${collection.insertedId}`, ...collectionData };
  },
};
