
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
/**
 * Model Gift
 * 
 */
export type Gift = $Result.DefaultSelection<Prisma.$GiftPayload>
/**
 * Model Wishlist
 * 
 */
export type Wishlist = $Result.DefaultSelection<Prisma.$WishlistPayload>
/**
 * Model SecretSantaEvent
 * 
 */
export type SecretSantaEvent = $Result.DefaultSelection<Prisma.$SecretSantaEventPayload>
/**
 * Model SecretSantaParticipant
 * 
 */
export type SecretSantaParticipant = $Result.DefaultSelection<Prisma.$SecretSantaParticipantPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gift`: Exposes CRUD operations for the **Gift** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Gifts
    * const gifts = await prisma.gift.findMany()
    * ```
    */
  get gift(): Prisma.GiftDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wishlist`: Exposes CRUD operations for the **Wishlist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Wishlists
    * const wishlists = await prisma.wishlist.findMany()
    * ```
    */
  get wishlist(): Prisma.WishlistDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.secretSantaEvent`: Exposes CRUD operations for the **SecretSantaEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SecretSantaEvents
    * const secretSantaEvents = await prisma.secretSantaEvent.findMany()
    * ```
    */
  get secretSantaEvent(): Prisma.SecretSantaEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.secretSantaParticipant`: Exposes CRUD operations for the **SecretSantaParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SecretSantaParticipants
    * const secretSantaParticipants = await prisma.secretSantaParticipant.findMany()
    * ```
    */
  get secretSantaParticipant(): Prisma.SecretSantaParticipantDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Account: 'Account',
    Session: 'Session',
    User: 'User',
    VerificationToken: 'VerificationToken',
    Gift: 'Gift',
    Wishlist: 'Wishlist',
    SecretSantaEvent: 'SecretSantaEvent',
    SecretSantaParticipant: 'SecretSantaParticipant'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "account" | "session" | "user" | "verificationToken" | "gift" | "wishlist" | "secretSantaEvent" | "secretSantaParticipant"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      Gift: {
        payload: Prisma.$GiftPayload<ExtArgs>
        fields: Prisma.GiftFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GiftFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GiftFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload>
          }
          findFirst: {
            args: Prisma.GiftFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GiftFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload>
          }
          findMany: {
            args: Prisma.GiftFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload>[]
          }
          create: {
            args: Prisma.GiftCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload>
          }
          createMany: {
            args: Prisma.GiftCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GiftCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload>[]
          }
          delete: {
            args: Prisma.GiftDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload>
          }
          update: {
            args: Prisma.GiftUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload>
          }
          deleteMany: {
            args: Prisma.GiftDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GiftUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GiftUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload>[]
          }
          upsert: {
            args: Prisma.GiftUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GiftPayload>
          }
          aggregate: {
            args: Prisma.GiftAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGift>
          }
          groupBy: {
            args: Prisma.GiftGroupByArgs<ExtArgs>
            result: $Utils.Optional<GiftGroupByOutputType>[]
          }
          count: {
            args: Prisma.GiftCountArgs<ExtArgs>
            result: $Utils.Optional<GiftCountAggregateOutputType> | number
          }
        }
      }
      Wishlist: {
        payload: Prisma.$WishlistPayload<ExtArgs>
        fields: Prisma.WishlistFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WishlistFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WishlistFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>
          }
          findFirst: {
            args: Prisma.WishlistFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WishlistFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>
          }
          findMany: {
            args: Prisma.WishlistFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>[]
          }
          create: {
            args: Prisma.WishlistCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>
          }
          createMany: {
            args: Prisma.WishlistCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WishlistCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>[]
          }
          delete: {
            args: Prisma.WishlistDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>
          }
          update: {
            args: Prisma.WishlistUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>
          }
          deleteMany: {
            args: Prisma.WishlistDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WishlistUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WishlistUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>[]
          }
          upsert: {
            args: Prisma.WishlistUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>
          }
          aggregate: {
            args: Prisma.WishlistAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWishlist>
          }
          groupBy: {
            args: Prisma.WishlistGroupByArgs<ExtArgs>
            result: $Utils.Optional<WishlistGroupByOutputType>[]
          }
          count: {
            args: Prisma.WishlistCountArgs<ExtArgs>
            result: $Utils.Optional<WishlistCountAggregateOutputType> | number
          }
        }
      }
      SecretSantaEvent: {
        payload: Prisma.$SecretSantaEventPayload<ExtArgs>
        fields: Prisma.SecretSantaEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SecretSantaEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SecretSantaEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload>
          }
          findFirst: {
            args: Prisma.SecretSantaEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SecretSantaEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload>
          }
          findMany: {
            args: Prisma.SecretSantaEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload>[]
          }
          create: {
            args: Prisma.SecretSantaEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload>
          }
          createMany: {
            args: Prisma.SecretSantaEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SecretSantaEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload>[]
          }
          delete: {
            args: Prisma.SecretSantaEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload>
          }
          update: {
            args: Prisma.SecretSantaEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload>
          }
          deleteMany: {
            args: Prisma.SecretSantaEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SecretSantaEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SecretSantaEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload>[]
          }
          upsert: {
            args: Prisma.SecretSantaEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaEventPayload>
          }
          aggregate: {
            args: Prisma.SecretSantaEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSecretSantaEvent>
          }
          groupBy: {
            args: Prisma.SecretSantaEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<SecretSantaEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.SecretSantaEventCountArgs<ExtArgs>
            result: $Utils.Optional<SecretSantaEventCountAggregateOutputType> | number
          }
        }
      }
      SecretSantaParticipant: {
        payload: Prisma.$SecretSantaParticipantPayload<ExtArgs>
        fields: Prisma.SecretSantaParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SecretSantaParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SecretSantaParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload>
          }
          findFirst: {
            args: Prisma.SecretSantaParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SecretSantaParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload>
          }
          findMany: {
            args: Prisma.SecretSantaParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload>[]
          }
          create: {
            args: Prisma.SecretSantaParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload>
          }
          createMany: {
            args: Prisma.SecretSantaParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SecretSantaParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload>[]
          }
          delete: {
            args: Prisma.SecretSantaParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload>
          }
          update: {
            args: Prisma.SecretSantaParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload>
          }
          deleteMany: {
            args: Prisma.SecretSantaParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SecretSantaParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SecretSantaParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload>[]
          }
          upsert: {
            args: Prisma.SecretSantaParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecretSantaParticipantPayload>
          }
          aggregate: {
            args: Prisma.SecretSantaParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSecretSantaParticipant>
          }
          groupBy: {
            args: Prisma.SecretSantaParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<SecretSantaParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.SecretSantaParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<SecretSantaParticipantCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    account?: AccountOmit
    session?: SessionOmit
    user?: UserOmit
    verificationToken?: VerificationTokenOmit
    gift?: GiftOmit
    wishlist?: WishlistOmit
    secretSantaEvent?: SecretSantaEventOmit
    secretSantaParticipant?: SecretSantaParticipantOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    gifts: number
    claimed: number
    createdGifts: number
    wishlists: number
    accounts: number
    sessions: number
    createdEvents: number
    secretSantaParticipations: number
    secretSantaAssignedTo: number
    secretSantaAssignedBy: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gifts?: boolean | UserCountOutputTypeCountGiftsArgs
    claimed?: boolean | UserCountOutputTypeCountClaimedArgs
    createdGifts?: boolean | UserCountOutputTypeCountCreatedGiftsArgs
    wishlists?: boolean | UserCountOutputTypeCountWishlistsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    createdEvents?: boolean | UserCountOutputTypeCountCreatedEventsArgs
    secretSantaParticipations?: boolean | UserCountOutputTypeCountSecretSantaParticipationsArgs
    secretSantaAssignedTo?: boolean | UserCountOutputTypeCountSecretSantaAssignedToArgs
    secretSantaAssignedBy?: boolean | UserCountOutputTypeCountSecretSantaAssignedByArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGiftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GiftWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountClaimedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GiftWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedGiftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GiftWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWishlistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WishlistWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecretSantaEventWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSecretSantaParticipationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecretSantaParticipantWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSecretSantaAssignedToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecretSantaParticipantWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSecretSantaAssignedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecretSantaParticipantWhereInput
  }


  /**
   * Count Type GiftCountOutputType
   */

  export type GiftCountOutputType = {
    wishlists: number
  }

  export type GiftCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wishlists?: boolean | GiftCountOutputTypeCountWishlistsArgs
  }

  // Custom InputTypes
  /**
   * GiftCountOutputType without action
   */
  export type GiftCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GiftCountOutputType
     */
    select?: GiftCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GiftCountOutputType without action
   */
  export type GiftCountOutputTypeCountWishlistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WishlistWhereInput
  }


  /**
   * Count Type WishlistCountOutputType
   */

  export type WishlistCountOutputType = {
    members: number
    gifts: number
  }

  export type WishlistCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | WishlistCountOutputTypeCountMembersArgs
    gifts?: boolean | WishlistCountOutputTypeCountGiftsArgs
  }

  // Custom InputTypes
  /**
   * WishlistCountOutputType without action
   */
  export type WishlistCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WishlistCountOutputType
     */
    select?: WishlistCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WishlistCountOutputType without action
   */
  export type WishlistCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * WishlistCountOutputType without action
   */
  export type WishlistCountOutputTypeCountGiftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GiftWhereInput
  }


  /**
   * Count Type SecretSantaEventCountOutputType
   */

  export type SecretSantaEventCountOutputType = {
    participants: number
  }

  export type SecretSantaEventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | SecretSantaEventCountOutputTypeCountParticipantsArgs
  }

  // Custom InputTypes
  /**
   * SecretSantaEventCountOutputType without action
   */
  export type SecretSantaEventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEventCountOutputType
     */
    select?: SecretSantaEventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SecretSantaEventCountOutputType without action
   */
  export type SecretSantaEventCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecretSantaParticipantWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    address: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    pant_size: string | null
    shirt_size: string | null
    shoe_size: string | null
    hasCompletedOnboarding: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    address: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    pant_size: string | null
    shirt_size: string | null
    shoe_size: string | null
    hasCompletedOnboarding: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    address: number
    email: number
    emailVerified: number
    image: number
    pant_size: number
    shirt_size: number
    shoe_size: number
    hasCompletedOnboarding: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    address?: true
    email?: true
    emailVerified?: true
    image?: true
    pant_size?: true
    shirt_size?: true
    shoe_size?: true
    hasCompletedOnboarding?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    address?: true
    email?: true
    emailVerified?: true
    image?: true
    pant_size?: true
    shirt_size?: true
    shoe_size?: true
    hasCompletedOnboarding?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    address?: true
    email?: true
    emailVerified?: true
    image?: true
    pant_size?: true
    shirt_size?: true
    shoe_size?: true
    hasCompletedOnboarding?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string | null
    address: string | null
    email: string
    emailVerified: Date | null
    image: string | null
    pant_size: string | null
    shirt_size: string | null
    shoe_size: string | null
    hasCompletedOnboarding: boolean
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    address?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    pant_size?: boolean
    shirt_size?: boolean
    shoe_size?: boolean
    hasCompletedOnboarding?: boolean
    gifts?: boolean | User$giftsArgs<ExtArgs>
    claimed?: boolean | User$claimedArgs<ExtArgs>
    createdGifts?: boolean | User$createdGiftsArgs<ExtArgs>
    wishlists?: boolean | User$wishlistsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    createdEvents?: boolean | User$createdEventsArgs<ExtArgs>
    secretSantaParticipations?: boolean | User$secretSantaParticipationsArgs<ExtArgs>
    secretSantaAssignedTo?: boolean | User$secretSantaAssignedToArgs<ExtArgs>
    secretSantaAssignedBy?: boolean | User$secretSantaAssignedByArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    address?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    pant_size?: boolean
    shirt_size?: boolean
    shoe_size?: boolean
    hasCompletedOnboarding?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    address?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    pant_size?: boolean
    shirt_size?: boolean
    shoe_size?: boolean
    hasCompletedOnboarding?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    address?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    pant_size?: boolean
    shirt_size?: boolean
    shoe_size?: boolean
    hasCompletedOnboarding?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "name" | "address" | "email" | "emailVerified" | "image" | "pant_size" | "shirt_size" | "shoe_size" | "hasCompletedOnboarding", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gifts?: boolean | User$giftsArgs<ExtArgs>
    claimed?: boolean | User$claimedArgs<ExtArgs>
    createdGifts?: boolean | User$createdGiftsArgs<ExtArgs>
    wishlists?: boolean | User$wishlistsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    createdEvents?: boolean | User$createdEventsArgs<ExtArgs>
    secretSantaParticipations?: boolean | User$secretSantaParticipationsArgs<ExtArgs>
    secretSantaAssignedTo?: boolean | User$secretSantaAssignedToArgs<ExtArgs>
    secretSantaAssignedBy?: boolean | User$secretSantaAssignedByArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      gifts: Prisma.$GiftPayload<ExtArgs>[]
      claimed: Prisma.$GiftPayload<ExtArgs>[]
      createdGifts: Prisma.$GiftPayload<ExtArgs>[]
      wishlists: Prisma.$WishlistPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      createdEvents: Prisma.$SecretSantaEventPayload<ExtArgs>[]
      secretSantaParticipations: Prisma.$SecretSantaParticipantPayload<ExtArgs>[]
      secretSantaAssignedTo: Prisma.$SecretSantaParticipantPayload<ExtArgs>[]
      secretSantaAssignedBy: Prisma.$SecretSantaParticipantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      name: string | null
      address: string | null
      email: string
      emailVerified: Date | null
      image: string | null
      pant_size: string | null
      shirt_size: string | null
      shoe_size: string | null
      hasCompletedOnboarding: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gifts<T extends User$giftsArgs<ExtArgs> = {}>(args?: Subset<T, User$giftsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    claimed<T extends User$claimedArgs<ExtArgs> = {}>(args?: Subset<T, User$claimedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdGifts<T extends User$createdGiftsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdGiftsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    wishlists<T extends User$wishlistsArgs<ExtArgs> = {}>(args?: Subset<T, User$wishlistsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdEvents<T extends User$createdEventsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    secretSantaParticipations<T extends User$secretSantaParticipationsArgs<ExtArgs> = {}>(args?: Subset<T, User$secretSantaParticipationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    secretSantaAssignedTo<T extends User$secretSantaAssignedToArgs<ExtArgs> = {}>(args?: Subset<T, User$secretSantaAssignedToArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    secretSantaAssignedBy<T extends User$secretSantaAssignedByArgs<ExtArgs> = {}>(args?: Subset<T, User$secretSantaAssignedByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly name: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly pant_size: FieldRef<"User", 'String'>
    readonly shirt_size: FieldRef<"User", 'String'>
    readonly shoe_size: FieldRef<"User", 'String'>
    readonly hasCompletedOnboarding: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.gifts
   */
  export type User$giftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    where?: GiftWhereInput
    orderBy?: GiftOrderByWithRelationInput | GiftOrderByWithRelationInput[]
    cursor?: GiftWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GiftScalarFieldEnum | GiftScalarFieldEnum[]
  }

  /**
   * User.claimed
   */
  export type User$claimedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    where?: GiftWhereInput
    orderBy?: GiftOrderByWithRelationInput | GiftOrderByWithRelationInput[]
    cursor?: GiftWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GiftScalarFieldEnum | GiftScalarFieldEnum[]
  }

  /**
   * User.createdGifts
   */
  export type User$createdGiftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    where?: GiftWhereInput
    orderBy?: GiftOrderByWithRelationInput | GiftOrderByWithRelationInput[]
    cursor?: GiftWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GiftScalarFieldEnum | GiftScalarFieldEnum[]
  }

  /**
   * User.wishlists
   */
  export type User$wishlistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    where?: WishlistWhereInput
    orderBy?: WishlistOrderByWithRelationInput | WishlistOrderByWithRelationInput[]
    cursor?: WishlistWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WishlistScalarFieldEnum | WishlistScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.createdEvents
   */
  export type User$createdEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
    where?: SecretSantaEventWhereInput
    orderBy?: SecretSantaEventOrderByWithRelationInput | SecretSantaEventOrderByWithRelationInput[]
    cursor?: SecretSantaEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SecretSantaEventScalarFieldEnum | SecretSantaEventScalarFieldEnum[]
  }

  /**
   * User.secretSantaParticipations
   */
  export type User$secretSantaParticipationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    where?: SecretSantaParticipantWhereInput
    orderBy?: SecretSantaParticipantOrderByWithRelationInput | SecretSantaParticipantOrderByWithRelationInput[]
    cursor?: SecretSantaParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SecretSantaParticipantScalarFieldEnum | SecretSantaParticipantScalarFieldEnum[]
  }

  /**
   * User.secretSantaAssignedTo
   */
  export type User$secretSantaAssignedToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    where?: SecretSantaParticipantWhereInput
    orderBy?: SecretSantaParticipantOrderByWithRelationInput | SecretSantaParticipantOrderByWithRelationInput[]
    cursor?: SecretSantaParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SecretSantaParticipantScalarFieldEnum | SecretSantaParticipantScalarFieldEnum[]
  }

  /**
   * User.secretSantaAssignedBy
   */
  export type User$secretSantaAssignedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    where?: SecretSantaParticipantWhereInput
    orderBy?: SecretSantaParticipantOrderByWithRelationInput | SecretSantaParticipantOrderByWithRelationInput[]
    cursor?: SecretSantaParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SecretSantaParticipantScalarFieldEnum | SecretSantaParticipantScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type VerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>

  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens and returns the data updated in the database.
     * @param {VerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many VerificationTokens.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.updateManyAndReturn({
     *   select: { identifier: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationToken model
   */
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken updateManyAndReturn
   */
  export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Model Gift
   */

  export type AggregateGift = {
    _count: GiftCountAggregateOutputType | null
    _min: GiftMinAggregateOutputType | null
    _max: GiftMaxAggregateOutputType | null
  }

  export type GiftMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    image: string | null
    url: string | null
    description: string | null
    published: boolean | null
    ownerId: string | null
    claimed: boolean | null
    claimedById: string | null
    createdById: string | null
  }

  export type GiftMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    image: string | null
    url: string | null
    description: string | null
    published: boolean | null
    ownerId: string | null
    claimed: boolean | null
    claimedById: string | null
    createdById: string | null
  }

  export type GiftCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    image: number
    url: number
    description: number
    published: number
    ownerId: number
    claimed: number
    claimedById: number
    createdById: number
    _all: number
  }


  export type GiftMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    image?: true
    url?: true
    description?: true
    published?: true
    ownerId?: true
    claimed?: true
    claimedById?: true
    createdById?: true
  }

  export type GiftMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    image?: true
    url?: true
    description?: true
    published?: true
    ownerId?: true
    claimed?: true
    claimedById?: true
    createdById?: true
  }

  export type GiftCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    image?: true
    url?: true
    description?: true
    published?: true
    ownerId?: true
    claimed?: true
    claimedById?: true
    createdById?: true
    _all?: true
  }

  export type GiftAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gift to aggregate.
     */
    where?: GiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gifts to fetch.
     */
    orderBy?: GiftOrderByWithRelationInput | GiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Gifts
    **/
    _count?: true | GiftCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GiftMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GiftMaxAggregateInputType
  }

  export type GetGiftAggregateType<T extends GiftAggregateArgs> = {
        [P in keyof T & keyof AggregateGift]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGift[P]>
      : GetScalarType<T[P], AggregateGift[P]>
  }




  export type GiftGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GiftWhereInput
    orderBy?: GiftOrderByWithAggregationInput | GiftOrderByWithAggregationInput[]
    by: GiftScalarFieldEnum[] | GiftScalarFieldEnum
    having?: GiftScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GiftCountAggregateInputType | true
    _min?: GiftMinAggregateInputType
    _max?: GiftMaxAggregateInputType
  }

  export type GiftGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    image: string | null
    url: string | null
    description: string | null
    published: boolean
    ownerId: string
    claimed: boolean
    claimedById: string | null
    createdById: string | null
    _count: GiftCountAggregateOutputType | null
    _min: GiftMinAggregateOutputType | null
    _max: GiftMaxAggregateOutputType | null
  }

  type GetGiftGroupByPayload<T extends GiftGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GiftGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GiftGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GiftGroupByOutputType[P]>
            : GetScalarType<T[P], GiftGroupByOutputType[P]>
        }
      >
    >


  export type GiftSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    image?: boolean
    url?: boolean
    description?: boolean
    published?: boolean
    ownerId?: boolean
    claimed?: boolean
    claimedById?: boolean
    createdById?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    claimedBy?: boolean | Gift$claimedByArgs<ExtArgs>
    createdBy?: boolean | Gift$createdByArgs<ExtArgs>
    wishlists?: boolean | Gift$wishlistsArgs<ExtArgs>
    _count?: boolean | GiftCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gift"]>

  export type GiftSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    image?: boolean
    url?: boolean
    description?: boolean
    published?: boolean
    ownerId?: boolean
    claimed?: boolean
    claimedById?: boolean
    createdById?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    claimedBy?: boolean | Gift$claimedByArgs<ExtArgs>
    createdBy?: boolean | Gift$createdByArgs<ExtArgs>
  }, ExtArgs["result"]["gift"]>

  export type GiftSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    image?: boolean
    url?: boolean
    description?: boolean
    published?: boolean
    ownerId?: boolean
    claimed?: boolean
    claimedById?: boolean
    createdById?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    claimedBy?: boolean | Gift$claimedByArgs<ExtArgs>
    createdBy?: boolean | Gift$createdByArgs<ExtArgs>
  }, ExtArgs["result"]["gift"]>

  export type GiftSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    image?: boolean
    url?: boolean
    description?: boolean
    published?: boolean
    ownerId?: boolean
    claimed?: boolean
    claimedById?: boolean
    createdById?: boolean
  }

  export type GiftOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "name" | "image" | "url" | "description" | "published" | "ownerId" | "claimed" | "claimedById" | "createdById", ExtArgs["result"]["gift"]>
  export type GiftInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    claimedBy?: boolean | Gift$claimedByArgs<ExtArgs>
    createdBy?: boolean | Gift$createdByArgs<ExtArgs>
    wishlists?: boolean | Gift$wishlistsArgs<ExtArgs>
    _count?: boolean | GiftCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GiftIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    claimedBy?: boolean | Gift$claimedByArgs<ExtArgs>
    createdBy?: boolean | Gift$createdByArgs<ExtArgs>
  }
  export type GiftIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    claimedBy?: boolean | Gift$claimedByArgs<ExtArgs>
    createdBy?: boolean | Gift$createdByArgs<ExtArgs>
  }

  export type $GiftPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Gift"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      claimedBy: Prisma.$UserPayload<ExtArgs> | null
      createdBy: Prisma.$UserPayload<ExtArgs> | null
      wishlists: Prisma.$WishlistPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      name: string
      image: string | null
      url: string | null
      description: string | null
      published: boolean
      ownerId: string
      claimed: boolean
      claimedById: string | null
      createdById: string | null
    }, ExtArgs["result"]["gift"]>
    composites: {}
  }

  type GiftGetPayload<S extends boolean | null | undefined | GiftDefaultArgs> = $Result.GetResult<Prisma.$GiftPayload, S>

  type GiftCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GiftFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GiftCountAggregateInputType | true
    }

  export interface GiftDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Gift'], meta: { name: 'Gift' } }
    /**
     * Find zero or one Gift that matches the filter.
     * @param {GiftFindUniqueArgs} args - Arguments to find a Gift
     * @example
     * // Get one Gift
     * const gift = await prisma.gift.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GiftFindUniqueArgs>(args: SelectSubset<T, GiftFindUniqueArgs<ExtArgs>>): Prisma__GiftClient<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Gift that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GiftFindUniqueOrThrowArgs} args - Arguments to find a Gift
     * @example
     * // Get one Gift
     * const gift = await prisma.gift.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GiftFindUniqueOrThrowArgs>(args: SelectSubset<T, GiftFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GiftClient<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gift that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftFindFirstArgs} args - Arguments to find a Gift
     * @example
     * // Get one Gift
     * const gift = await prisma.gift.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GiftFindFirstArgs>(args?: SelectSubset<T, GiftFindFirstArgs<ExtArgs>>): Prisma__GiftClient<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gift that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftFindFirstOrThrowArgs} args - Arguments to find a Gift
     * @example
     * // Get one Gift
     * const gift = await prisma.gift.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GiftFindFirstOrThrowArgs>(args?: SelectSubset<T, GiftFindFirstOrThrowArgs<ExtArgs>>): Prisma__GiftClient<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Gifts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Gifts
     * const gifts = await prisma.gift.findMany()
     * 
     * // Get first 10 Gifts
     * const gifts = await prisma.gift.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const giftWithIdOnly = await prisma.gift.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GiftFindManyArgs>(args?: SelectSubset<T, GiftFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Gift.
     * @param {GiftCreateArgs} args - Arguments to create a Gift.
     * @example
     * // Create one Gift
     * const Gift = await prisma.gift.create({
     *   data: {
     *     // ... data to create a Gift
     *   }
     * })
     * 
     */
    create<T extends GiftCreateArgs>(args: SelectSubset<T, GiftCreateArgs<ExtArgs>>): Prisma__GiftClient<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Gifts.
     * @param {GiftCreateManyArgs} args - Arguments to create many Gifts.
     * @example
     * // Create many Gifts
     * const gift = await prisma.gift.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GiftCreateManyArgs>(args?: SelectSubset<T, GiftCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Gifts and returns the data saved in the database.
     * @param {GiftCreateManyAndReturnArgs} args - Arguments to create many Gifts.
     * @example
     * // Create many Gifts
     * const gift = await prisma.gift.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Gifts and only return the `id`
     * const giftWithIdOnly = await prisma.gift.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GiftCreateManyAndReturnArgs>(args?: SelectSubset<T, GiftCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Gift.
     * @param {GiftDeleteArgs} args - Arguments to delete one Gift.
     * @example
     * // Delete one Gift
     * const Gift = await prisma.gift.delete({
     *   where: {
     *     // ... filter to delete one Gift
     *   }
     * })
     * 
     */
    delete<T extends GiftDeleteArgs>(args: SelectSubset<T, GiftDeleteArgs<ExtArgs>>): Prisma__GiftClient<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Gift.
     * @param {GiftUpdateArgs} args - Arguments to update one Gift.
     * @example
     * // Update one Gift
     * const gift = await prisma.gift.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GiftUpdateArgs>(args: SelectSubset<T, GiftUpdateArgs<ExtArgs>>): Prisma__GiftClient<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Gifts.
     * @param {GiftDeleteManyArgs} args - Arguments to filter Gifts to delete.
     * @example
     * // Delete a few Gifts
     * const { count } = await prisma.gift.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GiftDeleteManyArgs>(args?: SelectSubset<T, GiftDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gifts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Gifts
     * const gift = await prisma.gift.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GiftUpdateManyArgs>(args: SelectSubset<T, GiftUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gifts and returns the data updated in the database.
     * @param {GiftUpdateManyAndReturnArgs} args - Arguments to update many Gifts.
     * @example
     * // Update many Gifts
     * const gift = await prisma.gift.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Gifts and only return the `id`
     * const giftWithIdOnly = await prisma.gift.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GiftUpdateManyAndReturnArgs>(args: SelectSubset<T, GiftUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Gift.
     * @param {GiftUpsertArgs} args - Arguments to update or create a Gift.
     * @example
     * // Update or create a Gift
     * const gift = await prisma.gift.upsert({
     *   create: {
     *     // ... data to create a Gift
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Gift we want to update
     *   }
     * })
     */
    upsert<T extends GiftUpsertArgs>(args: SelectSubset<T, GiftUpsertArgs<ExtArgs>>): Prisma__GiftClient<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Gifts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftCountArgs} args - Arguments to filter Gifts to count.
     * @example
     * // Count the number of Gifts
     * const count = await prisma.gift.count({
     *   where: {
     *     // ... the filter for the Gifts we want to count
     *   }
     * })
    **/
    count<T extends GiftCountArgs>(
      args?: Subset<T, GiftCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GiftCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Gift.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GiftAggregateArgs>(args: Subset<T, GiftAggregateArgs>): Prisma.PrismaPromise<GetGiftAggregateType<T>>

    /**
     * Group by Gift.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GiftGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GiftGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GiftGroupByArgs['orderBy'] }
        : { orderBy?: GiftGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GiftGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGiftGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Gift model
   */
  readonly fields: GiftFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Gift.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GiftClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    claimedBy<T extends Gift$claimedByArgs<ExtArgs> = {}>(args?: Subset<T, Gift$claimedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    createdBy<T extends Gift$createdByArgs<ExtArgs> = {}>(args?: Subset<T, Gift$createdByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    wishlists<T extends Gift$wishlistsArgs<ExtArgs> = {}>(args?: Subset<T, Gift$wishlistsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Gift model
   */
  interface GiftFieldRefs {
    readonly id: FieldRef<"Gift", 'String'>
    readonly createdAt: FieldRef<"Gift", 'DateTime'>
    readonly updatedAt: FieldRef<"Gift", 'DateTime'>
    readonly name: FieldRef<"Gift", 'String'>
    readonly image: FieldRef<"Gift", 'String'>
    readonly url: FieldRef<"Gift", 'String'>
    readonly description: FieldRef<"Gift", 'String'>
    readonly published: FieldRef<"Gift", 'Boolean'>
    readonly ownerId: FieldRef<"Gift", 'String'>
    readonly claimed: FieldRef<"Gift", 'Boolean'>
    readonly claimedById: FieldRef<"Gift", 'String'>
    readonly createdById: FieldRef<"Gift", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Gift findUnique
   */
  export type GiftFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    /**
     * Filter, which Gift to fetch.
     */
    where: GiftWhereUniqueInput
  }

  /**
   * Gift findUniqueOrThrow
   */
  export type GiftFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    /**
     * Filter, which Gift to fetch.
     */
    where: GiftWhereUniqueInput
  }

  /**
   * Gift findFirst
   */
  export type GiftFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    /**
     * Filter, which Gift to fetch.
     */
    where?: GiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gifts to fetch.
     */
    orderBy?: GiftOrderByWithRelationInput | GiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gifts.
     */
    cursor?: GiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gifts.
     */
    distinct?: GiftScalarFieldEnum | GiftScalarFieldEnum[]
  }

  /**
   * Gift findFirstOrThrow
   */
  export type GiftFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    /**
     * Filter, which Gift to fetch.
     */
    where?: GiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gifts to fetch.
     */
    orderBy?: GiftOrderByWithRelationInput | GiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gifts.
     */
    cursor?: GiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gifts.
     */
    distinct?: GiftScalarFieldEnum | GiftScalarFieldEnum[]
  }

  /**
   * Gift findMany
   */
  export type GiftFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    /**
     * Filter, which Gifts to fetch.
     */
    where?: GiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gifts to fetch.
     */
    orderBy?: GiftOrderByWithRelationInput | GiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Gifts.
     */
    cursor?: GiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gifts.
     */
    skip?: number
    distinct?: GiftScalarFieldEnum | GiftScalarFieldEnum[]
  }

  /**
   * Gift create
   */
  export type GiftCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    /**
     * The data needed to create a Gift.
     */
    data: XOR<GiftCreateInput, GiftUncheckedCreateInput>
  }

  /**
   * Gift createMany
   */
  export type GiftCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Gifts.
     */
    data: GiftCreateManyInput | GiftCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Gift createManyAndReturn
   */
  export type GiftCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * The data used to create many Gifts.
     */
    data: GiftCreateManyInput | GiftCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Gift update
   */
  export type GiftUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    /**
     * The data needed to update a Gift.
     */
    data: XOR<GiftUpdateInput, GiftUncheckedUpdateInput>
    /**
     * Choose, which Gift to update.
     */
    where: GiftWhereUniqueInput
  }

  /**
   * Gift updateMany
   */
  export type GiftUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Gifts.
     */
    data: XOR<GiftUpdateManyMutationInput, GiftUncheckedUpdateManyInput>
    /**
     * Filter which Gifts to update
     */
    where?: GiftWhereInput
    /**
     * Limit how many Gifts to update.
     */
    limit?: number
  }

  /**
   * Gift updateManyAndReturn
   */
  export type GiftUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * The data used to update Gifts.
     */
    data: XOR<GiftUpdateManyMutationInput, GiftUncheckedUpdateManyInput>
    /**
     * Filter which Gifts to update
     */
    where?: GiftWhereInput
    /**
     * Limit how many Gifts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Gift upsert
   */
  export type GiftUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    /**
     * The filter to search for the Gift to update in case it exists.
     */
    where: GiftWhereUniqueInput
    /**
     * In case the Gift found by the `where` argument doesn't exist, create a new Gift with this data.
     */
    create: XOR<GiftCreateInput, GiftUncheckedCreateInput>
    /**
     * In case the Gift was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GiftUpdateInput, GiftUncheckedUpdateInput>
  }

  /**
   * Gift delete
   */
  export type GiftDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    /**
     * Filter which Gift to delete.
     */
    where: GiftWhereUniqueInput
  }

  /**
   * Gift deleteMany
   */
  export type GiftDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gifts to delete
     */
    where?: GiftWhereInput
    /**
     * Limit how many Gifts to delete.
     */
    limit?: number
  }

  /**
   * Gift.claimedBy
   */
  export type Gift$claimedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Gift.createdBy
   */
  export type Gift$createdByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Gift.wishlists
   */
  export type Gift$wishlistsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    where?: WishlistWhereInput
    orderBy?: WishlistOrderByWithRelationInput | WishlistOrderByWithRelationInput[]
    cursor?: WishlistWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WishlistScalarFieldEnum | WishlistScalarFieldEnum[]
  }

  /**
   * Gift without action
   */
  export type GiftDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
  }


  /**
   * Model Wishlist
   */

  export type AggregateWishlist = {
    _count: WishlistCountAggregateOutputType | null
    _min: WishlistMinAggregateOutputType | null
    _max: WishlistMaxAggregateOutputType | null
  }

  export type WishlistMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    password: string | null
  }

  export type WishlistMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    password: string | null
  }

  export type WishlistCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    password: number
    _all: number
  }


  export type WishlistMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    password?: true
  }

  export type WishlistMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    password?: true
  }

  export type WishlistCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    password?: true
    _all?: true
  }

  export type WishlistAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wishlist to aggregate.
     */
    where?: WishlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wishlists to fetch.
     */
    orderBy?: WishlistOrderByWithRelationInput | WishlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WishlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wishlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wishlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Wishlists
    **/
    _count?: true | WishlistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WishlistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WishlistMaxAggregateInputType
  }

  export type GetWishlistAggregateType<T extends WishlistAggregateArgs> = {
        [P in keyof T & keyof AggregateWishlist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWishlist[P]>
      : GetScalarType<T[P], AggregateWishlist[P]>
  }




  export type WishlistGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WishlistWhereInput
    orderBy?: WishlistOrderByWithAggregationInput | WishlistOrderByWithAggregationInput[]
    by: WishlistScalarFieldEnum[] | WishlistScalarFieldEnum
    having?: WishlistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WishlistCountAggregateInputType | true
    _min?: WishlistMinAggregateInputType
    _max?: WishlistMaxAggregateInputType
  }

  export type WishlistGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    password: string
    _count: WishlistCountAggregateOutputType | null
    _min: WishlistMinAggregateOutputType | null
    _max: WishlistMaxAggregateOutputType | null
  }

  type GetWishlistGroupByPayload<T extends WishlistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WishlistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WishlistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WishlistGroupByOutputType[P]>
            : GetScalarType<T[P], WishlistGroupByOutputType[P]>
        }
      >
    >


  export type WishlistSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    password?: boolean
    members?: boolean | Wishlist$membersArgs<ExtArgs>
    gifts?: boolean | Wishlist$giftsArgs<ExtArgs>
    _count?: boolean | WishlistCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wishlist"]>

  export type WishlistSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    password?: boolean
  }, ExtArgs["result"]["wishlist"]>

  export type WishlistSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    password?: boolean
  }, ExtArgs["result"]["wishlist"]>

  export type WishlistSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    password?: boolean
  }

  export type WishlistOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "name" | "password", ExtArgs["result"]["wishlist"]>
  export type WishlistInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Wishlist$membersArgs<ExtArgs>
    gifts?: boolean | Wishlist$giftsArgs<ExtArgs>
    _count?: boolean | WishlistCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WishlistIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type WishlistIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WishlistPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Wishlist"
    objects: {
      members: Prisma.$UserPayload<ExtArgs>[]
      gifts: Prisma.$GiftPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      name: string
      password: string
    }, ExtArgs["result"]["wishlist"]>
    composites: {}
  }

  type WishlistGetPayload<S extends boolean | null | undefined | WishlistDefaultArgs> = $Result.GetResult<Prisma.$WishlistPayload, S>

  type WishlistCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WishlistFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WishlistCountAggregateInputType | true
    }

  export interface WishlistDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Wishlist'], meta: { name: 'Wishlist' } }
    /**
     * Find zero or one Wishlist that matches the filter.
     * @param {WishlistFindUniqueArgs} args - Arguments to find a Wishlist
     * @example
     * // Get one Wishlist
     * const wishlist = await prisma.wishlist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WishlistFindUniqueArgs>(args: SelectSubset<T, WishlistFindUniqueArgs<ExtArgs>>): Prisma__WishlistClient<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Wishlist that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WishlistFindUniqueOrThrowArgs} args - Arguments to find a Wishlist
     * @example
     * // Get one Wishlist
     * const wishlist = await prisma.wishlist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WishlistFindUniqueOrThrowArgs>(args: SelectSubset<T, WishlistFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WishlistClient<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wishlist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistFindFirstArgs} args - Arguments to find a Wishlist
     * @example
     * // Get one Wishlist
     * const wishlist = await prisma.wishlist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WishlistFindFirstArgs>(args?: SelectSubset<T, WishlistFindFirstArgs<ExtArgs>>): Prisma__WishlistClient<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wishlist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistFindFirstOrThrowArgs} args - Arguments to find a Wishlist
     * @example
     * // Get one Wishlist
     * const wishlist = await prisma.wishlist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WishlistFindFirstOrThrowArgs>(args?: SelectSubset<T, WishlistFindFirstOrThrowArgs<ExtArgs>>): Prisma__WishlistClient<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Wishlists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Wishlists
     * const wishlists = await prisma.wishlist.findMany()
     * 
     * // Get first 10 Wishlists
     * const wishlists = await prisma.wishlist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const wishlistWithIdOnly = await prisma.wishlist.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WishlistFindManyArgs>(args?: SelectSubset<T, WishlistFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Wishlist.
     * @param {WishlistCreateArgs} args - Arguments to create a Wishlist.
     * @example
     * // Create one Wishlist
     * const Wishlist = await prisma.wishlist.create({
     *   data: {
     *     // ... data to create a Wishlist
     *   }
     * })
     * 
     */
    create<T extends WishlistCreateArgs>(args: SelectSubset<T, WishlistCreateArgs<ExtArgs>>): Prisma__WishlistClient<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Wishlists.
     * @param {WishlistCreateManyArgs} args - Arguments to create many Wishlists.
     * @example
     * // Create many Wishlists
     * const wishlist = await prisma.wishlist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WishlistCreateManyArgs>(args?: SelectSubset<T, WishlistCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Wishlists and returns the data saved in the database.
     * @param {WishlistCreateManyAndReturnArgs} args - Arguments to create many Wishlists.
     * @example
     * // Create many Wishlists
     * const wishlist = await prisma.wishlist.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Wishlists and only return the `id`
     * const wishlistWithIdOnly = await prisma.wishlist.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WishlistCreateManyAndReturnArgs>(args?: SelectSubset<T, WishlistCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Wishlist.
     * @param {WishlistDeleteArgs} args - Arguments to delete one Wishlist.
     * @example
     * // Delete one Wishlist
     * const Wishlist = await prisma.wishlist.delete({
     *   where: {
     *     // ... filter to delete one Wishlist
     *   }
     * })
     * 
     */
    delete<T extends WishlistDeleteArgs>(args: SelectSubset<T, WishlistDeleteArgs<ExtArgs>>): Prisma__WishlistClient<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Wishlist.
     * @param {WishlistUpdateArgs} args - Arguments to update one Wishlist.
     * @example
     * // Update one Wishlist
     * const wishlist = await prisma.wishlist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WishlistUpdateArgs>(args: SelectSubset<T, WishlistUpdateArgs<ExtArgs>>): Prisma__WishlistClient<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Wishlists.
     * @param {WishlistDeleteManyArgs} args - Arguments to filter Wishlists to delete.
     * @example
     * // Delete a few Wishlists
     * const { count } = await prisma.wishlist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WishlistDeleteManyArgs>(args?: SelectSubset<T, WishlistDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wishlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Wishlists
     * const wishlist = await prisma.wishlist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WishlistUpdateManyArgs>(args: SelectSubset<T, WishlistUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wishlists and returns the data updated in the database.
     * @param {WishlistUpdateManyAndReturnArgs} args - Arguments to update many Wishlists.
     * @example
     * // Update many Wishlists
     * const wishlist = await prisma.wishlist.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Wishlists and only return the `id`
     * const wishlistWithIdOnly = await prisma.wishlist.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WishlistUpdateManyAndReturnArgs>(args: SelectSubset<T, WishlistUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Wishlist.
     * @param {WishlistUpsertArgs} args - Arguments to update or create a Wishlist.
     * @example
     * // Update or create a Wishlist
     * const wishlist = await prisma.wishlist.upsert({
     *   create: {
     *     // ... data to create a Wishlist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wishlist we want to update
     *   }
     * })
     */
    upsert<T extends WishlistUpsertArgs>(args: SelectSubset<T, WishlistUpsertArgs<ExtArgs>>): Prisma__WishlistClient<$Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Wishlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistCountArgs} args - Arguments to filter Wishlists to count.
     * @example
     * // Count the number of Wishlists
     * const count = await prisma.wishlist.count({
     *   where: {
     *     // ... the filter for the Wishlists we want to count
     *   }
     * })
    **/
    count<T extends WishlistCountArgs>(
      args?: Subset<T, WishlistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WishlistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Wishlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WishlistAggregateArgs>(args: Subset<T, WishlistAggregateArgs>): Prisma.PrismaPromise<GetWishlistAggregateType<T>>

    /**
     * Group by Wishlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WishlistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WishlistGroupByArgs['orderBy'] }
        : { orderBy?: WishlistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WishlistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWishlistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Wishlist model
   */
  readonly fields: WishlistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wishlist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WishlistClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Wishlist$membersArgs<ExtArgs> = {}>(args?: Subset<T, Wishlist$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gifts<T extends Wishlist$giftsArgs<ExtArgs> = {}>(args?: Subset<T, Wishlist$giftsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GiftPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Wishlist model
   */
  interface WishlistFieldRefs {
    readonly id: FieldRef<"Wishlist", 'String'>
    readonly createdAt: FieldRef<"Wishlist", 'DateTime'>
    readonly updatedAt: FieldRef<"Wishlist", 'DateTime'>
    readonly name: FieldRef<"Wishlist", 'String'>
    readonly password: FieldRef<"Wishlist", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Wishlist findUnique
   */
  export type WishlistFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    /**
     * Filter, which Wishlist to fetch.
     */
    where: WishlistWhereUniqueInput
  }

  /**
   * Wishlist findUniqueOrThrow
   */
  export type WishlistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    /**
     * Filter, which Wishlist to fetch.
     */
    where: WishlistWhereUniqueInput
  }

  /**
   * Wishlist findFirst
   */
  export type WishlistFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    /**
     * Filter, which Wishlist to fetch.
     */
    where?: WishlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wishlists to fetch.
     */
    orderBy?: WishlistOrderByWithRelationInput | WishlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wishlists.
     */
    cursor?: WishlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wishlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wishlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wishlists.
     */
    distinct?: WishlistScalarFieldEnum | WishlistScalarFieldEnum[]
  }

  /**
   * Wishlist findFirstOrThrow
   */
  export type WishlistFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    /**
     * Filter, which Wishlist to fetch.
     */
    where?: WishlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wishlists to fetch.
     */
    orderBy?: WishlistOrderByWithRelationInput | WishlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wishlists.
     */
    cursor?: WishlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wishlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wishlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wishlists.
     */
    distinct?: WishlistScalarFieldEnum | WishlistScalarFieldEnum[]
  }

  /**
   * Wishlist findMany
   */
  export type WishlistFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    /**
     * Filter, which Wishlists to fetch.
     */
    where?: WishlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wishlists to fetch.
     */
    orderBy?: WishlistOrderByWithRelationInput | WishlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Wishlists.
     */
    cursor?: WishlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wishlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wishlists.
     */
    skip?: number
    distinct?: WishlistScalarFieldEnum | WishlistScalarFieldEnum[]
  }

  /**
   * Wishlist create
   */
  export type WishlistCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    /**
     * The data needed to create a Wishlist.
     */
    data: XOR<WishlistCreateInput, WishlistUncheckedCreateInput>
  }

  /**
   * Wishlist createMany
   */
  export type WishlistCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Wishlists.
     */
    data: WishlistCreateManyInput | WishlistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wishlist createManyAndReturn
   */
  export type WishlistCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * The data used to create many Wishlists.
     */
    data: WishlistCreateManyInput | WishlistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wishlist update
   */
  export type WishlistUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    /**
     * The data needed to update a Wishlist.
     */
    data: XOR<WishlistUpdateInput, WishlistUncheckedUpdateInput>
    /**
     * Choose, which Wishlist to update.
     */
    where: WishlistWhereUniqueInput
  }

  /**
   * Wishlist updateMany
   */
  export type WishlistUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Wishlists.
     */
    data: XOR<WishlistUpdateManyMutationInput, WishlistUncheckedUpdateManyInput>
    /**
     * Filter which Wishlists to update
     */
    where?: WishlistWhereInput
    /**
     * Limit how many Wishlists to update.
     */
    limit?: number
  }

  /**
   * Wishlist updateManyAndReturn
   */
  export type WishlistUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * The data used to update Wishlists.
     */
    data: XOR<WishlistUpdateManyMutationInput, WishlistUncheckedUpdateManyInput>
    /**
     * Filter which Wishlists to update
     */
    where?: WishlistWhereInput
    /**
     * Limit how many Wishlists to update.
     */
    limit?: number
  }

  /**
   * Wishlist upsert
   */
  export type WishlistUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    /**
     * The filter to search for the Wishlist to update in case it exists.
     */
    where: WishlistWhereUniqueInput
    /**
     * In case the Wishlist found by the `where` argument doesn't exist, create a new Wishlist with this data.
     */
    create: XOR<WishlistCreateInput, WishlistUncheckedCreateInput>
    /**
     * In case the Wishlist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WishlistUpdateInput, WishlistUncheckedUpdateInput>
  }

  /**
   * Wishlist delete
   */
  export type WishlistDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
    /**
     * Filter which Wishlist to delete.
     */
    where: WishlistWhereUniqueInput
  }

  /**
   * Wishlist deleteMany
   */
  export type WishlistDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wishlists to delete
     */
    where?: WishlistWhereInput
    /**
     * Limit how many Wishlists to delete.
     */
    limit?: number
  }

  /**
   * Wishlist.members
   */
  export type Wishlist$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Wishlist.gifts
   */
  export type Wishlist$giftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gift
     */
    select?: GiftSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gift
     */
    omit?: GiftOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GiftInclude<ExtArgs> | null
    where?: GiftWhereInput
    orderBy?: GiftOrderByWithRelationInput | GiftOrderByWithRelationInput[]
    cursor?: GiftWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GiftScalarFieldEnum | GiftScalarFieldEnum[]
  }

  /**
   * Wishlist without action
   */
  export type WishlistDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wishlist
     */
    omit?: WishlistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null
  }


  /**
   * Model SecretSantaEvent
   */

  export type AggregateSecretSantaEvent = {
    _count: SecretSantaEventCountAggregateOutputType | null
    _min: SecretSantaEventMinAggregateOutputType | null
    _max: SecretSantaEventMaxAggregateOutputType | null
  }

  export type SecretSantaEventMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    createdById: string | null
  }

  export type SecretSantaEventMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
    createdById: string | null
  }

  export type SecretSantaEventCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    createdById: number
    _all: number
  }


  export type SecretSantaEventMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    createdById?: true
  }

  export type SecretSantaEventMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    createdById?: true
  }

  export type SecretSantaEventCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    createdById?: true
    _all?: true
  }

  export type SecretSantaEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecretSantaEvent to aggregate.
     */
    where?: SecretSantaEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecretSantaEvents to fetch.
     */
    orderBy?: SecretSantaEventOrderByWithRelationInput | SecretSantaEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SecretSantaEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecretSantaEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecretSantaEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SecretSantaEvents
    **/
    _count?: true | SecretSantaEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SecretSantaEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SecretSantaEventMaxAggregateInputType
  }

  export type GetSecretSantaEventAggregateType<T extends SecretSantaEventAggregateArgs> = {
        [P in keyof T & keyof AggregateSecretSantaEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSecretSantaEvent[P]>
      : GetScalarType<T[P], AggregateSecretSantaEvent[P]>
  }




  export type SecretSantaEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecretSantaEventWhereInput
    orderBy?: SecretSantaEventOrderByWithAggregationInput | SecretSantaEventOrderByWithAggregationInput[]
    by: SecretSantaEventScalarFieldEnum[] | SecretSantaEventScalarFieldEnum
    having?: SecretSantaEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SecretSantaEventCountAggregateInputType | true
    _min?: SecretSantaEventMinAggregateInputType
    _max?: SecretSantaEventMaxAggregateInputType
  }

  export type SecretSantaEventGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    createdById: string
    _count: SecretSantaEventCountAggregateOutputType | null
    _min: SecretSantaEventMinAggregateOutputType | null
    _max: SecretSantaEventMaxAggregateOutputType | null
  }

  type GetSecretSantaEventGroupByPayload<T extends SecretSantaEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SecretSantaEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SecretSantaEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SecretSantaEventGroupByOutputType[P]>
            : GetScalarType<T[P], SecretSantaEventGroupByOutputType[P]>
        }
      >
    >


  export type SecretSantaEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    participants?: boolean | SecretSantaEvent$participantsArgs<ExtArgs>
    _count?: boolean | SecretSantaEventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["secretSantaEvent"]>

  export type SecretSantaEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["secretSantaEvent"]>

  export type SecretSantaEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["secretSantaEvent"]>

  export type SecretSantaEventSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdById?: boolean
  }

  export type SecretSantaEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt" | "createdById", ExtArgs["result"]["secretSantaEvent"]>
  export type SecretSantaEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    participants?: boolean | SecretSantaEvent$participantsArgs<ExtArgs>
    _count?: boolean | SecretSantaEventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SecretSantaEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SecretSantaEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SecretSantaEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SecretSantaEvent"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
      participants: Prisma.$SecretSantaParticipantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
      createdById: string
    }, ExtArgs["result"]["secretSantaEvent"]>
    composites: {}
  }

  type SecretSantaEventGetPayload<S extends boolean | null | undefined | SecretSantaEventDefaultArgs> = $Result.GetResult<Prisma.$SecretSantaEventPayload, S>

  type SecretSantaEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SecretSantaEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SecretSantaEventCountAggregateInputType | true
    }

  export interface SecretSantaEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SecretSantaEvent'], meta: { name: 'SecretSantaEvent' } }
    /**
     * Find zero or one SecretSantaEvent that matches the filter.
     * @param {SecretSantaEventFindUniqueArgs} args - Arguments to find a SecretSantaEvent
     * @example
     * // Get one SecretSantaEvent
     * const secretSantaEvent = await prisma.secretSantaEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SecretSantaEventFindUniqueArgs>(args: SelectSubset<T, SecretSantaEventFindUniqueArgs<ExtArgs>>): Prisma__SecretSantaEventClient<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SecretSantaEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SecretSantaEventFindUniqueOrThrowArgs} args - Arguments to find a SecretSantaEvent
     * @example
     * // Get one SecretSantaEvent
     * const secretSantaEvent = await prisma.secretSantaEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SecretSantaEventFindUniqueOrThrowArgs>(args: SelectSubset<T, SecretSantaEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SecretSantaEventClient<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecretSantaEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaEventFindFirstArgs} args - Arguments to find a SecretSantaEvent
     * @example
     * // Get one SecretSantaEvent
     * const secretSantaEvent = await prisma.secretSantaEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SecretSantaEventFindFirstArgs>(args?: SelectSubset<T, SecretSantaEventFindFirstArgs<ExtArgs>>): Prisma__SecretSantaEventClient<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecretSantaEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaEventFindFirstOrThrowArgs} args - Arguments to find a SecretSantaEvent
     * @example
     * // Get one SecretSantaEvent
     * const secretSantaEvent = await prisma.secretSantaEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SecretSantaEventFindFirstOrThrowArgs>(args?: SelectSubset<T, SecretSantaEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__SecretSantaEventClient<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SecretSantaEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SecretSantaEvents
     * const secretSantaEvents = await prisma.secretSantaEvent.findMany()
     * 
     * // Get first 10 SecretSantaEvents
     * const secretSantaEvents = await prisma.secretSantaEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const secretSantaEventWithIdOnly = await prisma.secretSantaEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SecretSantaEventFindManyArgs>(args?: SelectSubset<T, SecretSantaEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SecretSantaEvent.
     * @param {SecretSantaEventCreateArgs} args - Arguments to create a SecretSantaEvent.
     * @example
     * // Create one SecretSantaEvent
     * const SecretSantaEvent = await prisma.secretSantaEvent.create({
     *   data: {
     *     // ... data to create a SecretSantaEvent
     *   }
     * })
     * 
     */
    create<T extends SecretSantaEventCreateArgs>(args: SelectSubset<T, SecretSantaEventCreateArgs<ExtArgs>>): Prisma__SecretSantaEventClient<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SecretSantaEvents.
     * @param {SecretSantaEventCreateManyArgs} args - Arguments to create many SecretSantaEvents.
     * @example
     * // Create many SecretSantaEvents
     * const secretSantaEvent = await prisma.secretSantaEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SecretSantaEventCreateManyArgs>(args?: SelectSubset<T, SecretSantaEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SecretSantaEvents and returns the data saved in the database.
     * @param {SecretSantaEventCreateManyAndReturnArgs} args - Arguments to create many SecretSantaEvents.
     * @example
     * // Create many SecretSantaEvents
     * const secretSantaEvent = await prisma.secretSantaEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SecretSantaEvents and only return the `id`
     * const secretSantaEventWithIdOnly = await prisma.secretSantaEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SecretSantaEventCreateManyAndReturnArgs>(args?: SelectSubset<T, SecretSantaEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SecretSantaEvent.
     * @param {SecretSantaEventDeleteArgs} args - Arguments to delete one SecretSantaEvent.
     * @example
     * // Delete one SecretSantaEvent
     * const SecretSantaEvent = await prisma.secretSantaEvent.delete({
     *   where: {
     *     // ... filter to delete one SecretSantaEvent
     *   }
     * })
     * 
     */
    delete<T extends SecretSantaEventDeleteArgs>(args: SelectSubset<T, SecretSantaEventDeleteArgs<ExtArgs>>): Prisma__SecretSantaEventClient<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SecretSantaEvent.
     * @param {SecretSantaEventUpdateArgs} args - Arguments to update one SecretSantaEvent.
     * @example
     * // Update one SecretSantaEvent
     * const secretSantaEvent = await prisma.secretSantaEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SecretSantaEventUpdateArgs>(args: SelectSubset<T, SecretSantaEventUpdateArgs<ExtArgs>>): Prisma__SecretSantaEventClient<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SecretSantaEvents.
     * @param {SecretSantaEventDeleteManyArgs} args - Arguments to filter SecretSantaEvents to delete.
     * @example
     * // Delete a few SecretSantaEvents
     * const { count } = await prisma.secretSantaEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SecretSantaEventDeleteManyArgs>(args?: SelectSubset<T, SecretSantaEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecretSantaEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SecretSantaEvents
     * const secretSantaEvent = await prisma.secretSantaEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SecretSantaEventUpdateManyArgs>(args: SelectSubset<T, SecretSantaEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecretSantaEvents and returns the data updated in the database.
     * @param {SecretSantaEventUpdateManyAndReturnArgs} args - Arguments to update many SecretSantaEvents.
     * @example
     * // Update many SecretSantaEvents
     * const secretSantaEvent = await prisma.secretSantaEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SecretSantaEvents and only return the `id`
     * const secretSantaEventWithIdOnly = await prisma.secretSantaEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SecretSantaEventUpdateManyAndReturnArgs>(args: SelectSubset<T, SecretSantaEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SecretSantaEvent.
     * @param {SecretSantaEventUpsertArgs} args - Arguments to update or create a SecretSantaEvent.
     * @example
     * // Update or create a SecretSantaEvent
     * const secretSantaEvent = await prisma.secretSantaEvent.upsert({
     *   create: {
     *     // ... data to create a SecretSantaEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SecretSantaEvent we want to update
     *   }
     * })
     */
    upsert<T extends SecretSantaEventUpsertArgs>(args: SelectSubset<T, SecretSantaEventUpsertArgs<ExtArgs>>): Prisma__SecretSantaEventClient<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SecretSantaEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaEventCountArgs} args - Arguments to filter SecretSantaEvents to count.
     * @example
     * // Count the number of SecretSantaEvents
     * const count = await prisma.secretSantaEvent.count({
     *   where: {
     *     // ... the filter for the SecretSantaEvents we want to count
     *   }
     * })
    **/
    count<T extends SecretSantaEventCountArgs>(
      args?: Subset<T, SecretSantaEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SecretSantaEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SecretSantaEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SecretSantaEventAggregateArgs>(args: Subset<T, SecretSantaEventAggregateArgs>): Prisma.PrismaPromise<GetSecretSantaEventAggregateType<T>>

    /**
     * Group by SecretSantaEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SecretSantaEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SecretSantaEventGroupByArgs['orderBy'] }
        : { orderBy?: SecretSantaEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SecretSantaEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSecretSantaEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SecretSantaEvent model
   */
  readonly fields: SecretSantaEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SecretSantaEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SecretSantaEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    participants<T extends SecretSantaEvent$participantsArgs<ExtArgs> = {}>(args?: Subset<T, SecretSantaEvent$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SecretSantaEvent model
   */
  interface SecretSantaEventFieldRefs {
    readonly id: FieldRef<"SecretSantaEvent", 'String'>
    readonly name: FieldRef<"SecretSantaEvent", 'String'>
    readonly createdAt: FieldRef<"SecretSantaEvent", 'DateTime'>
    readonly updatedAt: FieldRef<"SecretSantaEvent", 'DateTime'>
    readonly createdById: FieldRef<"SecretSantaEvent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SecretSantaEvent findUnique
   */
  export type SecretSantaEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
    /**
     * Filter, which SecretSantaEvent to fetch.
     */
    where: SecretSantaEventWhereUniqueInput
  }

  /**
   * SecretSantaEvent findUniqueOrThrow
   */
  export type SecretSantaEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
    /**
     * Filter, which SecretSantaEvent to fetch.
     */
    where: SecretSantaEventWhereUniqueInput
  }

  /**
   * SecretSantaEvent findFirst
   */
  export type SecretSantaEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
    /**
     * Filter, which SecretSantaEvent to fetch.
     */
    where?: SecretSantaEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecretSantaEvents to fetch.
     */
    orderBy?: SecretSantaEventOrderByWithRelationInput | SecretSantaEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecretSantaEvents.
     */
    cursor?: SecretSantaEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecretSantaEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecretSantaEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecretSantaEvents.
     */
    distinct?: SecretSantaEventScalarFieldEnum | SecretSantaEventScalarFieldEnum[]
  }

  /**
   * SecretSantaEvent findFirstOrThrow
   */
  export type SecretSantaEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
    /**
     * Filter, which SecretSantaEvent to fetch.
     */
    where?: SecretSantaEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecretSantaEvents to fetch.
     */
    orderBy?: SecretSantaEventOrderByWithRelationInput | SecretSantaEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecretSantaEvents.
     */
    cursor?: SecretSantaEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecretSantaEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecretSantaEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecretSantaEvents.
     */
    distinct?: SecretSantaEventScalarFieldEnum | SecretSantaEventScalarFieldEnum[]
  }

  /**
   * SecretSantaEvent findMany
   */
  export type SecretSantaEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
    /**
     * Filter, which SecretSantaEvents to fetch.
     */
    where?: SecretSantaEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecretSantaEvents to fetch.
     */
    orderBy?: SecretSantaEventOrderByWithRelationInput | SecretSantaEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SecretSantaEvents.
     */
    cursor?: SecretSantaEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecretSantaEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecretSantaEvents.
     */
    skip?: number
    distinct?: SecretSantaEventScalarFieldEnum | SecretSantaEventScalarFieldEnum[]
  }

  /**
   * SecretSantaEvent create
   */
  export type SecretSantaEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
    /**
     * The data needed to create a SecretSantaEvent.
     */
    data: XOR<SecretSantaEventCreateInput, SecretSantaEventUncheckedCreateInput>
  }

  /**
   * SecretSantaEvent createMany
   */
  export type SecretSantaEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SecretSantaEvents.
     */
    data: SecretSantaEventCreateManyInput | SecretSantaEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SecretSantaEvent createManyAndReturn
   */
  export type SecretSantaEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * The data used to create many SecretSantaEvents.
     */
    data: SecretSantaEventCreateManyInput | SecretSantaEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SecretSantaEvent update
   */
  export type SecretSantaEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
    /**
     * The data needed to update a SecretSantaEvent.
     */
    data: XOR<SecretSantaEventUpdateInput, SecretSantaEventUncheckedUpdateInput>
    /**
     * Choose, which SecretSantaEvent to update.
     */
    where: SecretSantaEventWhereUniqueInput
  }

  /**
   * SecretSantaEvent updateMany
   */
  export type SecretSantaEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SecretSantaEvents.
     */
    data: XOR<SecretSantaEventUpdateManyMutationInput, SecretSantaEventUncheckedUpdateManyInput>
    /**
     * Filter which SecretSantaEvents to update
     */
    where?: SecretSantaEventWhereInput
    /**
     * Limit how many SecretSantaEvents to update.
     */
    limit?: number
  }

  /**
   * SecretSantaEvent updateManyAndReturn
   */
  export type SecretSantaEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * The data used to update SecretSantaEvents.
     */
    data: XOR<SecretSantaEventUpdateManyMutationInput, SecretSantaEventUncheckedUpdateManyInput>
    /**
     * Filter which SecretSantaEvents to update
     */
    where?: SecretSantaEventWhereInput
    /**
     * Limit how many SecretSantaEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SecretSantaEvent upsert
   */
  export type SecretSantaEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
    /**
     * The filter to search for the SecretSantaEvent to update in case it exists.
     */
    where: SecretSantaEventWhereUniqueInput
    /**
     * In case the SecretSantaEvent found by the `where` argument doesn't exist, create a new SecretSantaEvent with this data.
     */
    create: XOR<SecretSantaEventCreateInput, SecretSantaEventUncheckedCreateInput>
    /**
     * In case the SecretSantaEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SecretSantaEventUpdateInput, SecretSantaEventUncheckedUpdateInput>
  }

  /**
   * SecretSantaEvent delete
   */
  export type SecretSantaEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
    /**
     * Filter which SecretSantaEvent to delete.
     */
    where: SecretSantaEventWhereUniqueInput
  }

  /**
   * SecretSantaEvent deleteMany
   */
  export type SecretSantaEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecretSantaEvents to delete
     */
    where?: SecretSantaEventWhereInput
    /**
     * Limit how many SecretSantaEvents to delete.
     */
    limit?: number
  }

  /**
   * SecretSantaEvent.participants
   */
  export type SecretSantaEvent$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    where?: SecretSantaParticipantWhereInput
    orderBy?: SecretSantaParticipantOrderByWithRelationInput | SecretSantaParticipantOrderByWithRelationInput[]
    cursor?: SecretSantaParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SecretSantaParticipantScalarFieldEnum | SecretSantaParticipantScalarFieldEnum[]
  }

  /**
   * SecretSantaEvent without action
   */
  export type SecretSantaEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaEvent
     */
    select?: SecretSantaEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaEvent
     */
    omit?: SecretSantaEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaEventInclude<ExtArgs> | null
  }


  /**
   * Model SecretSantaParticipant
   */

  export type AggregateSecretSantaParticipant = {
    _count: SecretSantaParticipantCountAggregateOutputType | null
    _min: SecretSantaParticipantMinAggregateOutputType | null
    _max: SecretSantaParticipantMaxAggregateOutputType | null
  }

  export type SecretSantaParticipantMinAggregateOutputType = {
    id: string | null
    eventId: string | null
    userId: string | null
    assignedToId: string | null
    assignedById: string | null
  }

  export type SecretSantaParticipantMaxAggregateOutputType = {
    id: string | null
    eventId: string | null
    userId: string | null
    assignedToId: string | null
    assignedById: string | null
  }

  export type SecretSantaParticipantCountAggregateOutputType = {
    id: number
    eventId: number
    userId: number
    assignedToId: number
    assignedById: number
    _all: number
  }


  export type SecretSantaParticipantMinAggregateInputType = {
    id?: true
    eventId?: true
    userId?: true
    assignedToId?: true
    assignedById?: true
  }

  export type SecretSantaParticipantMaxAggregateInputType = {
    id?: true
    eventId?: true
    userId?: true
    assignedToId?: true
    assignedById?: true
  }

  export type SecretSantaParticipantCountAggregateInputType = {
    id?: true
    eventId?: true
    userId?: true
    assignedToId?: true
    assignedById?: true
    _all?: true
  }

  export type SecretSantaParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecretSantaParticipant to aggregate.
     */
    where?: SecretSantaParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecretSantaParticipants to fetch.
     */
    orderBy?: SecretSantaParticipantOrderByWithRelationInput | SecretSantaParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SecretSantaParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecretSantaParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecretSantaParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SecretSantaParticipants
    **/
    _count?: true | SecretSantaParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SecretSantaParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SecretSantaParticipantMaxAggregateInputType
  }

  export type GetSecretSantaParticipantAggregateType<T extends SecretSantaParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateSecretSantaParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSecretSantaParticipant[P]>
      : GetScalarType<T[P], AggregateSecretSantaParticipant[P]>
  }




  export type SecretSantaParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecretSantaParticipantWhereInput
    orderBy?: SecretSantaParticipantOrderByWithAggregationInput | SecretSantaParticipantOrderByWithAggregationInput[]
    by: SecretSantaParticipantScalarFieldEnum[] | SecretSantaParticipantScalarFieldEnum
    having?: SecretSantaParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SecretSantaParticipantCountAggregateInputType | true
    _min?: SecretSantaParticipantMinAggregateInputType
    _max?: SecretSantaParticipantMaxAggregateInputType
  }

  export type SecretSantaParticipantGroupByOutputType = {
    id: string
    eventId: string
    userId: string
    assignedToId: string | null
    assignedById: string | null
    _count: SecretSantaParticipantCountAggregateOutputType | null
    _min: SecretSantaParticipantMinAggregateOutputType | null
    _max: SecretSantaParticipantMaxAggregateOutputType | null
  }

  type GetSecretSantaParticipantGroupByPayload<T extends SecretSantaParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SecretSantaParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SecretSantaParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SecretSantaParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], SecretSantaParticipantGroupByOutputType[P]>
        }
      >
    >


  export type SecretSantaParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    userId?: boolean
    assignedToId?: boolean
    assignedById?: boolean
    event?: boolean | SecretSantaEventDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | SecretSantaParticipant$assignedToArgs<ExtArgs>
    assignedBy?: boolean | SecretSantaParticipant$assignedByArgs<ExtArgs>
  }, ExtArgs["result"]["secretSantaParticipant"]>

  export type SecretSantaParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    userId?: boolean
    assignedToId?: boolean
    assignedById?: boolean
    event?: boolean | SecretSantaEventDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | SecretSantaParticipant$assignedToArgs<ExtArgs>
    assignedBy?: boolean | SecretSantaParticipant$assignedByArgs<ExtArgs>
  }, ExtArgs["result"]["secretSantaParticipant"]>

  export type SecretSantaParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventId?: boolean
    userId?: boolean
    assignedToId?: boolean
    assignedById?: boolean
    event?: boolean | SecretSantaEventDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | SecretSantaParticipant$assignedToArgs<ExtArgs>
    assignedBy?: boolean | SecretSantaParticipant$assignedByArgs<ExtArgs>
  }, ExtArgs["result"]["secretSantaParticipant"]>

  export type SecretSantaParticipantSelectScalar = {
    id?: boolean
    eventId?: boolean
    userId?: boolean
    assignedToId?: boolean
    assignedById?: boolean
  }

  export type SecretSantaParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventId" | "userId" | "assignedToId" | "assignedById", ExtArgs["result"]["secretSantaParticipant"]>
  export type SecretSantaParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | SecretSantaEventDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | SecretSantaParticipant$assignedToArgs<ExtArgs>
    assignedBy?: boolean | SecretSantaParticipant$assignedByArgs<ExtArgs>
  }
  export type SecretSantaParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | SecretSantaEventDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | SecretSantaParticipant$assignedToArgs<ExtArgs>
    assignedBy?: boolean | SecretSantaParticipant$assignedByArgs<ExtArgs>
  }
  export type SecretSantaParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | SecretSantaEventDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    assignedTo?: boolean | SecretSantaParticipant$assignedToArgs<ExtArgs>
    assignedBy?: boolean | SecretSantaParticipant$assignedByArgs<ExtArgs>
  }

  export type $SecretSantaParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SecretSantaParticipant"
    objects: {
      event: Prisma.$SecretSantaEventPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      assignedTo: Prisma.$UserPayload<ExtArgs> | null
      assignedBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventId: string
      userId: string
      assignedToId: string | null
      assignedById: string | null
    }, ExtArgs["result"]["secretSantaParticipant"]>
    composites: {}
  }

  type SecretSantaParticipantGetPayload<S extends boolean | null | undefined | SecretSantaParticipantDefaultArgs> = $Result.GetResult<Prisma.$SecretSantaParticipantPayload, S>

  type SecretSantaParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SecretSantaParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SecretSantaParticipantCountAggregateInputType | true
    }

  export interface SecretSantaParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SecretSantaParticipant'], meta: { name: 'SecretSantaParticipant' } }
    /**
     * Find zero or one SecretSantaParticipant that matches the filter.
     * @param {SecretSantaParticipantFindUniqueArgs} args - Arguments to find a SecretSantaParticipant
     * @example
     * // Get one SecretSantaParticipant
     * const secretSantaParticipant = await prisma.secretSantaParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SecretSantaParticipantFindUniqueArgs>(args: SelectSubset<T, SecretSantaParticipantFindUniqueArgs<ExtArgs>>): Prisma__SecretSantaParticipantClient<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SecretSantaParticipant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SecretSantaParticipantFindUniqueOrThrowArgs} args - Arguments to find a SecretSantaParticipant
     * @example
     * // Get one SecretSantaParticipant
     * const secretSantaParticipant = await prisma.secretSantaParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SecretSantaParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, SecretSantaParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SecretSantaParticipantClient<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecretSantaParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaParticipantFindFirstArgs} args - Arguments to find a SecretSantaParticipant
     * @example
     * // Get one SecretSantaParticipant
     * const secretSantaParticipant = await prisma.secretSantaParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SecretSantaParticipantFindFirstArgs>(args?: SelectSubset<T, SecretSantaParticipantFindFirstArgs<ExtArgs>>): Prisma__SecretSantaParticipantClient<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecretSantaParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaParticipantFindFirstOrThrowArgs} args - Arguments to find a SecretSantaParticipant
     * @example
     * // Get one SecretSantaParticipant
     * const secretSantaParticipant = await prisma.secretSantaParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SecretSantaParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, SecretSantaParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__SecretSantaParticipantClient<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SecretSantaParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SecretSantaParticipants
     * const secretSantaParticipants = await prisma.secretSantaParticipant.findMany()
     * 
     * // Get first 10 SecretSantaParticipants
     * const secretSantaParticipants = await prisma.secretSantaParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const secretSantaParticipantWithIdOnly = await prisma.secretSantaParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SecretSantaParticipantFindManyArgs>(args?: SelectSubset<T, SecretSantaParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SecretSantaParticipant.
     * @param {SecretSantaParticipantCreateArgs} args - Arguments to create a SecretSantaParticipant.
     * @example
     * // Create one SecretSantaParticipant
     * const SecretSantaParticipant = await prisma.secretSantaParticipant.create({
     *   data: {
     *     // ... data to create a SecretSantaParticipant
     *   }
     * })
     * 
     */
    create<T extends SecretSantaParticipantCreateArgs>(args: SelectSubset<T, SecretSantaParticipantCreateArgs<ExtArgs>>): Prisma__SecretSantaParticipantClient<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SecretSantaParticipants.
     * @param {SecretSantaParticipantCreateManyArgs} args - Arguments to create many SecretSantaParticipants.
     * @example
     * // Create many SecretSantaParticipants
     * const secretSantaParticipant = await prisma.secretSantaParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SecretSantaParticipantCreateManyArgs>(args?: SelectSubset<T, SecretSantaParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SecretSantaParticipants and returns the data saved in the database.
     * @param {SecretSantaParticipantCreateManyAndReturnArgs} args - Arguments to create many SecretSantaParticipants.
     * @example
     * // Create many SecretSantaParticipants
     * const secretSantaParticipant = await prisma.secretSantaParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SecretSantaParticipants and only return the `id`
     * const secretSantaParticipantWithIdOnly = await prisma.secretSantaParticipant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SecretSantaParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, SecretSantaParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SecretSantaParticipant.
     * @param {SecretSantaParticipantDeleteArgs} args - Arguments to delete one SecretSantaParticipant.
     * @example
     * // Delete one SecretSantaParticipant
     * const SecretSantaParticipant = await prisma.secretSantaParticipant.delete({
     *   where: {
     *     // ... filter to delete one SecretSantaParticipant
     *   }
     * })
     * 
     */
    delete<T extends SecretSantaParticipantDeleteArgs>(args: SelectSubset<T, SecretSantaParticipantDeleteArgs<ExtArgs>>): Prisma__SecretSantaParticipantClient<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SecretSantaParticipant.
     * @param {SecretSantaParticipantUpdateArgs} args - Arguments to update one SecretSantaParticipant.
     * @example
     * // Update one SecretSantaParticipant
     * const secretSantaParticipant = await prisma.secretSantaParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SecretSantaParticipantUpdateArgs>(args: SelectSubset<T, SecretSantaParticipantUpdateArgs<ExtArgs>>): Prisma__SecretSantaParticipantClient<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SecretSantaParticipants.
     * @param {SecretSantaParticipantDeleteManyArgs} args - Arguments to filter SecretSantaParticipants to delete.
     * @example
     * // Delete a few SecretSantaParticipants
     * const { count } = await prisma.secretSantaParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SecretSantaParticipantDeleteManyArgs>(args?: SelectSubset<T, SecretSantaParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecretSantaParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SecretSantaParticipants
     * const secretSantaParticipant = await prisma.secretSantaParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SecretSantaParticipantUpdateManyArgs>(args: SelectSubset<T, SecretSantaParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecretSantaParticipants and returns the data updated in the database.
     * @param {SecretSantaParticipantUpdateManyAndReturnArgs} args - Arguments to update many SecretSantaParticipants.
     * @example
     * // Update many SecretSantaParticipants
     * const secretSantaParticipant = await prisma.secretSantaParticipant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SecretSantaParticipants and only return the `id`
     * const secretSantaParticipantWithIdOnly = await prisma.secretSantaParticipant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SecretSantaParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, SecretSantaParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SecretSantaParticipant.
     * @param {SecretSantaParticipantUpsertArgs} args - Arguments to update or create a SecretSantaParticipant.
     * @example
     * // Update or create a SecretSantaParticipant
     * const secretSantaParticipant = await prisma.secretSantaParticipant.upsert({
     *   create: {
     *     // ... data to create a SecretSantaParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SecretSantaParticipant we want to update
     *   }
     * })
     */
    upsert<T extends SecretSantaParticipantUpsertArgs>(args: SelectSubset<T, SecretSantaParticipantUpsertArgs<ExtArgs>>): Prisma__SecretSantaParticipantClient<$Result.GetResult<Prisma.$SecretSantaParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SecretSantaParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaParticipantCountArgs} args - Arguments to filter SecretSantaParticipants to count.
     * @example
     * // Count the number of SecretSantaParticipants
     * const count = await prisma.secretSantaParticipant.count({
     *   where: {
     *     // ... the filter for the SecretSantaParticipants we want to count
     *   }
     * })
    **/
    count<T extends SecretSantaParticipantCountArgs>(
      args?: Subset<T, SecretSantaParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SecretSantaParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SecretSantaParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SecretSantaParticipantAggregateArgs>(args: Subset<T, SecretSantaParticipantAggregateArgs>): Prisma.PrismaPromise<GetSecretSantaParticipantAggregateType<T>>

    /**
     * Group by SecretSantaParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecretSantaParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SecretSantaParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SecretSantaParticipantGroupByArgs['orderBy'] }
        : { orderBy?: SecretSantaParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SecretSantaParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSecretSantaParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SecretSantaParticipant model
   */
  readonly fields: SecretSantaParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SecretSantaParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SecretSantaParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends SecretSantaEventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SecretSantaEventDefaultArgs<ExtArgs>>): Prisma__SecretSantaEventClient<$Result.GetResult<Prisma.$SecretSantaEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assignedTo<T extends SecretSantaParticipant$assignedToArgs<ExtArgs> = {}>(args?: Subset<T, SecretSantaParticipant$assignedToArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    assignedBy<T extends SecretSantaParticipant$assignedByArgs<ExtArgs> = {}>(args?: Subset<T, SecretSantaParticipant$assignedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SecretSantaParticipant model
   */
  interface SecretSantaParticipantFieldRefs {
    readonly id: FieldRef<"SecretSantaParticipant", 'String'>
    readonly eventId: FieldRef<"SecretSantaParticipant", 'String'>
    readonly userId: FieldRef<"SecretSantaParticipant", 'String'>
    readonly assignedToId: FieldRef<"SecretSantaParticipant", 'String'>
    readonly assignedById: FieldRef<"SecretSantaParticipant", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SecretSantaParticipant findUnique
   */
  export type SecretSantaParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SecretSantaParticipant to fetch.
     */
    where: SecretSantaParticipantWhereUniqueInput
  }

  /**
   * SecretSantaParticipant findUniqueOrThrow
   */
  export type SecretSantaParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SecretSantaParticipant to fetch.
     */
    where: SecretSantaParticipantWhereUniqueInput
  }

  /**
   * SecretSantaParticipant findFirst
   */
  export type SecretSantaParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SecretSantaParticipant to fetch.
     */
    where?: SecretSantaParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecretSantaParticipants to fetch.
     */
    orderBy?: SecretSantaParticipantOrderByWithRelationInput | SecretSantaParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecretSantaParticipants.
     */
    cursor?: SecretSantaParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecretSantaParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecretSantaParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecretSantaParticipants.
     */
    distinct?: SecretSantaParticipantScalarFieldEnum | SecretSantaParticipantScalarFieldEnum[]
  }

  /**
   * SecretSantaParticipant findFirstOrThrow
   */
  export type SecretSantaParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SecretSantaParticipant to fetch.
     */
    where?: SecretSantaParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecretSantaParticipants to fetch.
     */
    orderBy?: SecretSantaParticipantOrderByWithRelationInput | SecretSantaParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecretSantaParticipants.
     */
    cursor?: SecretSantaParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecretSantaParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecretSantaParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecretSantaParticipants.
     */
    distinct?: SecretSantaParticipantScalarFieldEnum | SecretSantaParticipantScalarFieldEnum[]
  }

  /**
   * SecretSantaParticipant findMany
   */
  export type SecretSantaParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SecretSantaParticipants to fetch.
     */
    where?: SecretSantaParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecretSantaParticipants to fetch.
     */
    orderBy?: SecretSantaParticipantOrderByWithRelationInput | SecretSantaParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SecretSantaParticipants.
     */
    cursor?: SecretSantaParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecretSantaParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecretSantaParticipants.
     */
    skip?: number
    distinct?: SecretSantaParticipantScalarFieldEnum | SecretSantaParticipantScalarFieldEnum[]
  }

  /**
   * SecretSantaParticipant create
   */
  export type SecretSantaParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a SecretSantaParticipant.
     */
    data: XOR<SecretSantaParticipantCreateInput, SecretSantaParticipantUncheckedCreateInput>
  }

  /**
   * SecretSantaParticipant createMany
   */
  export type SecretSantaParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SecretSantaParticipants.
     */
    data: SecretSantaParticipantCreateManyInput | SecretSantaParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SecretSantaParticipant createManyAndReturn
   */
  export type SecretSantaParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many SecretSantaParticipants.
     */
    data: SecretSantaParticipantCreateManyInput | SecretSantaParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SecretSantaParticipant update
   */
  export type SecretSantaParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a SecretSantaParticipant.
     */
    data: XOR<SecretSantaParticipantUpdateInput, SecretSantaParticipantUncheckedUpdateInput>
    /**
     * Choose, which SecretSantaParticipant to update.
     */
    where: SecretSantaParticipantWhereUniqueInput
  }

  /**
   * SecretSantaParticipant updateMany
   */
  export type SecretSantaParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SecretSantaParticipants.
     */
    data: XOR<SecretSantaParticipantUpdateManyMutationInput, SecretSantaParticipantUncheckedUpdateManyInput>
    /**
     * Filter which SecretSantaParticipants to update
     */
    where?: SecretSantaParticipantWhereInput
    /**
     * Limit how many SecretSantaParticipants to update.
     */
    limit?: number
  }

  /**
   * SecretSantaParticipant updateManyAndReturn
   */
  export type SecretSantaParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * The data used to update SecretSantaParticipants.
     */
    data: XOR<SecretSantaParticipantUpdateManyMutationInput, SecretSantaParticipantUncheckedUpdateManyInput>
    /**
     * Filter which SecretSantaParticipants to update
     */
    where?: SecretSantaParticipantWhereInput
    /**
     * Limit how many SecretSantaParticipants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SecretSantaParticipant upsert
   */
  export type SecretSantaParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the SecretSantaParticipant to update in case it exists.
     */
    where: SecretSantaParticipantWhereUniqueInput
    /**
     * In case the SecretSantaParticipant found by the `where` argument doesn't exist, create a new SecretSantaParticipant with this data.
     */
    create: XOR<SecretSantaParticipantCreateInput, SecretSantaParticipantUncheckedCreateInput>
    /**
     * In case the SecretSantaParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SecretSantaParticipantUpdateInput, SecretSantaParticipantUncheckedUpdateInput>
  }

  /**
   * SecretSantaParticipant delete
   */
  export type SecretSantaParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
    /**
     * Filter which SecretSantaParticipant to delete.
     */
    where: SecretSantaParticipantWhereUniqueInput
  }

  /**
   * SecretSantaParticipant deleteMany
   */
  export type SecretSantaParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecretSantaParticipants to delete
     */
    where?: SecretSantaParticipantWhereInput
    /**
     * Limit how many SecretSantaParticipants to delete.
     */
    limit?: number
  }

  /**
   * SecretSantaParticipant.assignedTo
   */
  export type SecretSantaParticipant$assignedToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * SecretSantaParticipant.assignedBy
   */
  export type SecretSantaParticipant$assignedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * SecretSantaParticipant without action
   */
  export type SecretSantaParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecretSantaParticipant
     */
    select?: SecretSantaParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecretSantaParticipant
     */
    omit?: SecretSantaParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecretSantaParticipantInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    address: 'address',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    pant_size: 'pant_size',
    shirt_size: 'shirt_size',
    shoe_size: 'shoe_size',
    hasCompletedOnboarding: 'hasCompletedOnboarding'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const GiftScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    image: 'image',
    url: 'url',
    description: 'description',
    published: 'published',
    ownerId: 'ownerId',
    claimed: 'claimed',
    claimedById: 'claimedById',
    createdById: 'createdById'
  };

  export type GiftScalarFieldEnum = (typeof GiftScalarFieldEnum)[keyof typeof GiftScalarFieldEnum]


  export const WishlistScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    password: 'password'
  };

  export type WishlistScalarFieldEnum = (typeof WishlistScalarFieldEnum)[keyof typeof WishlistScalarFieldEnum]


  export const SecretSantaEventScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    createdById: 'createdById'
  };

  export type SecretSantaEventScalarFieldEnum = (typeof SecretSantaEventScalarFieldEnum)[keyof typeof SecretSantaEventScalarFieldEnum]


  export const SecretSantaParticipantScalarFieldEnum: {
    id: 'id',
    eventId: 'eventId',
    userId: 'userId',
    assignedToId: 'assignedToId',
    assignedById: 'assignedById'
  };

  export type SecretSantaParticipantScalarFieldEnum = (typeof SecretSantaParticipantScalarFieldEnum)[keyof typeof SecretSantaParticipantScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: UuidFilter<"Account"> | string
    userId?: UuidFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: UuidFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Account"> | string
    userId?: UuidWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: UuidFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: UuidFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: UuidFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: UuidWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    name?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    pant_size?: StringNullableFilter<"User"> | string | null
    shirt_size?: StringNullableFilter<"User"> | string | null
    shoe_size?: StringNullableFilter<"User"> | string | null
    hasCompletedOnboarding?: BoolFilter<"User"> | boolean
    gifts?: GiftListRelationFilter
    claimed?: GiftListRelationFilter
    createdGifts?: GiftListRelationFilter
    wishlists?: WishlistListRelationFilter
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    createdEvents?: SecretSantaEventListRelationFilter
    secretSantaParticipations?: SecretSantaParticipantListRelationFilter
    secretSantaAssignedTo?: SecretSantaParticipantListRelationFilter
    secretSantaAssignedBy?: SecretSantaParticipantListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    pant_size?: SortOrderInput | SortOrder
    shirt_size?: SortOrderInput | SortOrder
    shoe_size?: SortOrderInput | SortOrder
    hasCompletedOnboarding?: SortOrder
    gifts?: GiftOrderByRelationAggregateInput
    claimed?: GiftOrderByRelationAggregateInput
    createdGifts?: GiftOrderByRelationAggregateInput
    wishlists?: WishlistOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    createdEvents?: SecretSantaEventOrderByRelationAggregateInput
    secretSantaParticipations?: SecretSantaParticipantOrderByRelationAggregateInput
    secretSantaAssignedTo?: SecretSantaParticipantOrderByRelationAggregateInput
    secretSantaAssignedBy?: SecretSantaParticipantOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    name?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    pant_size?: StringNullableFilter<"User"> | string | null
    shirt_size?: StringNullableFilter<"User"> | string | null
    shoe_size?: StringNullableFilter<"User"> | string | null
    hasCompletedOnboarding?: BoolFilter<"User"> | boolean
    gifts?: GiftListRelationFilter
    claimed?: GiftListRelationFilter
    createdGifts?: GiftListRelationFilter
    wishlists?: WishlistListRelationFilter
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    createdEvents?: SecretSantaEventListRelationFilter
    secretSantaParticipations?: SecretSantaParticipantListRelationFilter
    secretSantaAssignedTo?: SecretSantaParticipantListRelationFilter
    secretSantaAssignedBy?: SecretSantaParticipantListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    pant_size?: SortOrderInput | SortOrder
    shirt_size?: SortOrderInput | SortOrder
    shoe_size?: SortOrderInput | SortOrder
    hasCompletedOnboarding?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    pant_size?: StringNullableWithAggregatesFilter<"User"> | string | null
    shirt_size?: StringNullableWithAggregatesFilter<"User"> | string | null
    shoe_size?: StringNullableWithAggregatesFilter<"User"> | string | null
    hasCompletedOnboarding?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type GiftWhereInput = {
    AND?: GiftWhereInput | GiftWhereInput[]
    OR?: GiftWhereInput[]
    NOT?: GiftWhereInput | GiftWhereInput[]
    id?: UuidFilter<"Gift"> | string
    createdAt?: DateTimeFilter<"Gift"> | Date | string
    updatedAt?: DateTimeFilter<"Gift"> | Date | string
    name?: StringFilter<"Gift"> | string
    image?: StringNullableFilter<"Gift"> | string | null
    url?: StringNullableFilter<"Gift"> | string | null
    description?: StringNullableFilter<"Gift"> | string | null
    published?: BoolFilter<"Gift"> | boolean
    ownerId?: UuidFilter<"Gift"> | string
    claimed?: BoolFilter<"Gift"> | boolean
    claimedById?: UuidNullableFilter<"Gift"> | string | null
    createdById?: UuidNullableFilter<"Gift"> | string | null
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    claimedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    createdBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    wishlists?: WishlistListRelationFilter
  }

  export type GiftOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    image?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    published?: SortOrder
    ownerId?: SortOrder
    claimed?: SortOrder
    claimedById?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    owner?: UserOrderByWithRelationInput
    claimedBy?: UserOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
    wishlists?: WishlistOrderByRelationAggregateInput
  }

  export type GiftWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GiftWhereInput | GiftWhereInput[]
    OR?: GiftWhereInput[]
    NOT?: GiftWhereInput | GiftWhereInput[]
    createdAt?: DateTimeFilter<"Gift"> | Date | string
    updatedAt?: DateTimeFilter<"Gift"> | Date | string
    name?: StringFilter<"Gift"> | string
    image?: StringNullableFilter<"Gift"> | string | null
    url?: StringNullableFilter<"Gift"> | string | null
    description?: StringNullableFilter<"Gift"> | string | null
    published?: BoolFilter<"Gift"> | boolean
    ownerId?: UuidFilter<"Gift"> | string
    claimed?: BoolFilter<"Gift"> | boolean
    claimedById?: UuidNullableFilter<"Gift"> | string | null
    createdById?: UuidNullableFilter<"Gift"> | string | null
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    claimedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    createdBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    wishlists?: WishlistListRelationFilter
  }, "id">

  export type GiftOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    image?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    published?: SortOrder
    ownerId?: SortOrder
    claimed?: SortOrder
    claimedById?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    _count?: GiftCountOrderByAggregateInput
    _max?: GiftMaxOrderByAggregateInput
    _min?: GiftMinOrderByAggregateInput
  }

  export type GiftScalarWhereWithAggregatesInput = {
    AND?: GiftScalarWhereWithAggregatesInput | GiftScalarWhereWithAggregatesInput[]
    OR?: GiftScalarWhereWithAggregatesInput[]
    NOT?: GiftScalarWhereWithAggregatesInput | GiftScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Gift"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Gift"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Gift"> | Date | string
    name?: StringWithAggregatesFilter<"Gift"> | string
    image?: StringNullableWithAggregatesFilter<"Gift"> | string | null
    url?: StringNullableWithAggregatesFilter<"Gift"> | string | null
    description?: StringNullableWithAggregatesFilter<"Gift"> | string | null
    published?: BoolWithAggregatesFilter<"Gift"> | boolean
    ownerId?: UuidWithAggregatesFilter<"Gift"> | string
    claimed?: BoolWithAggregatesFilter<"Gift"> | boolean
    claimedById?: UuidNullableWithAggregatesFilter<"Gift"> | string | null
    createdById?: UuidNullableWithAggregatesFilter<"Gift"> | string | null
  }

  export type WishlistWhereInput = {
    AND?: WishlistWhereInput | WishlistWhereInput[]
    OR?: WishlistWhereInput[]
    NOT?: WishlistWhereInput | WishlistWhereInput[]
    id?: UuidFilter<"Wishlist"> | string
    createdAt?: DateTimeFilter<"Wishlist"> | Date | string
    updatedAt?: DateTimeFilter<"Wishlist"> | Date | string
    name?: StringFilter<"Wishlist"> | string
    password?: StringFilter<"Wishlist"> | string
    members?: UserListRelationFilter
    gifts?: GiftListRelationFilter
  }

  export type WishlistOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    password?: SortOrder
    members?: UserOrderByRelationAggregateInput
    gifts?: GiftOrderByRelationAggregateInput
  }

  export type WishlistWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: WishlistWhereInput | WishlistWhereInput[]
    OR?: WishlistWhereInput[]
    NOT?: WishlistWhereInput | WishlistWhereInput[]
    createdAt?: DateTimeFilter<"Wishlist"> | Date | string
    updatedAt?: DateTimeFilter<"Wishlist"> | Date | string
    password?: StringFilter<"Wishlist"> | string
    members?: UserListRelationFilter
    gifts?: GiftListRelationFilter
  }, "id" | "name">

  export type WishlistOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    password?: SortOrder
    _count?: WishlistCountOrderByAggregateInput
    _max?: WishlistMaxOrderByAggregateInput
    _min?: WishlistMinOrderByAggregateInput
  }

  export type WishlistScalarWhereWithAggregatesInput = {
    AND?: WishlistScalarWhereWithAggregatesInput | WishlistScalarWhereWithAggregatesInput[]
    OR?: WishlistScalarWhereWithAggregatesInput[]
    NOT?: WishlistScalarWhereWithAggregatesInput | WishlistScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Wishlist"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Wishlist"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Wishlist"> | Date | string
    name?: StringWithAggregatesFilter<"Wishlist"> | string
    password?: StringWithAggregatesFilter<"Wishlist"> | string
  }

  export type SecretSantaEventWhereInput = {
    AND?: SecretSantaEventWhereInput | SecretSantaEventWhereInput[]
    OR?: SecretSantaEventWhereInput[]
    NOT?: SecretSantaEventWhereInput | SecretSantaEventWhereInput[]
    id?: UuidFilter<"SecretSantaEvent"> | string
    name?: StringFilter<"SecretSantaEvent"> | string
    createdAt?: DateTimeFilter<"SecretSantaEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SecretSantaEvent"> | Date | string
    createdById?: UuidFilter<"SecretSantaEvent"> | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    participants?: SecretSantaParticipantListRelationFilter
  }

  export type SecretSantaEventOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
    createdBy?: UserOrderByWithRelationInput
    participants?: SecretSantaParticipantOrderByRelationAggregateInput
  }

  export type SecretSantaEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SecretSantaEventWhereInput | SecretSantaEventWhereInput[]
    OR?: SecretSantaEventWhereInput[]
    NOT?: SecretSantaEventWhereInput | SecretSantaEventWhereInput[]
    name?: StringFilter<"SecretSantaEvent"> | string
    createdAt?: DateTimeFilter<"SecretSantaEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SecretSantaEvent"> | Date | string
    createdById?: UuidFilter<"SecretSantaEvent"> | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    participants?: SecretSantaParticipantListRelationFilter
  }, "id">

  export type SecretSantaEventOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
    _count?: SecretSantaEventCountOrderByAggregateInput
    _max?: SecretSantaEventMaxOrderByAggregateInput
    _min?: SecretSantaEventMinOrderByAggregateInput
  }

  export type SecretSantaEventScalarWhereWithAggregatesInput = {
    AND?: SecretSantaEventScalarWhereWithAggregatesInput | SecretSantaEventScalarWhereWithAggregatesInput[]
    OR?: SecretSantaEventScalarWhereWithAggregatesInput[]
    NOT?: SecretSantaEventScalarWhereWithAggregatesInput | SecretSantaEventScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SecretSantaEvent"> | string
    name?: StringWithAggregatesFilter<"SecretSantaEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SecretSantaEvent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SecretSantaEvent"> | Date | string
    createdById?: UuidWithAggregatesFilter<"SecretSantaEvent"> | string
  }

  export type SecretSantaParticipantWhereInput = {
    AND?: SecretSantaParticipantWhereInput | SecretSantaParticipantWhereInput[]
    OR?: SecretSantaParticipantWhereInput[]
    NOT?: SecretSantaParticipantWhereInput | SecretSantaParticipantWhereInput[]
    id?: UuidFilter<"SecretSantaParticipant"> | string
    eventId?: UuidFilter<"SecretSantaParticipant"> | string
    userId?: UuidFilter<"SecretSantaParticipant"> | string
    assignedToId?: UuidNullableFilter<"SecretSantaParticipant"> | string | null
    assignedById?: UuidNullableFilter<"SecretSantaParticipant"> | string | null
    event?: XOR<SecretSantaEventScalarRelationFilter, SecretSantaEventWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    assignedTo?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    assignedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type SecretSantaParticipantOrderByWithRelationInput = {
    id?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    assignedToId?: SortOrderInput | SortOrder
    assignedById?: SortOrderInput | SortOrder
    event?: SecretSantaEventOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    assignedTo?: UserOrderByWithRelationInput
    assignedBy?: UserOrderByWithRelationInput
  }

  export type SecretSantaParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    eventId_userId?: SecretSantaParticipantEventIdUserIdCompoundUniqueInput
    AND?: SecretSantaParticipantWhereInput | SecretSantaParticipantWhereInput[]
    OR?: SecretSantaParticipantWhereInput[]
    NOT?: SecretSantaParticipantWhereInput | SecretSantaParticipantWhereInput[]
    eventId?: UuidFilter<"SecretSantaParticipant"> | string
    userId?: UuidFilter<"SecretSantaParticipant"> | string
    assignedToId?: UuidNullableFilter<"SecretSantaParticipant"> | string | null
    assignedById?: UuidNullableFilter<"SecretSantaParticipant"> | string | null
    event?: XOR<SecretSantaEventScalarRelationFilter, SecretSantaEventWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    assignedTo?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    assignedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "eventId_userId">

  export type SecretSantaParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    assignedToId?: SortOrderInput | SortOrder
    assignedById?: SortOrderInput | SortOrder
    _count?: SecretSantaParticipantCountOrderByAggregateInput
    _max?: SecretSantaParticipantMaxOrderByAggregateInput
    _min?: SecretSantaParticipantMinOrderByAggregateInput
  }

  export type SecretSantaParticipantScalarWhereWithAggregatesInput = {
    AND?: SecretSantaParticipantScalarWhereWithAggregatesInput | SecretSantaParticipantScalarWhereWithAggregatesInput[]
    OR?: SecretSantaParticipantScalarWhereWithAggregatesInput[]
    NOT?: SecretSantaParticipantScalarWhereWithAggregatesInput | SecretSantaParticipantScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SecretSantaParticipant"> | string
    eventId?: UuidWithAggregatesFilter<"SecretSantaParticipant"> | string
    userId?: UuidWithAggregatesFilter<"SecretSantaParticipant"> | string
    assignedToId?: UuidNullableWithAggregatesFilter<"SecretSantaParticipant"> | string | null
    assignedById?: UuidNullableWithAggregatesFilter<"SecretSantaParticipant"> | string | null
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftCreateNestedManyWithoutOwnerInput
    claimed?: GiftCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistCreateNestedManyWithoutMembersInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantCreateNestedManyWithoutAssignedByInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftUncheckedCreateNestedManyWithoutOwnerInput
    claimed?: GiftUncheckedCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftUncheckedCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistUncheckedCreateNestedManyWithoutMembersInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUpdateManyWithoutMembersNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUncheckedUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUncheckedUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUncheckedUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUncheckedUpdateManyWithoutMembersNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GiftCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    claimed?: boolean
    owner: UserCreateNestedOneWithoutGiftsInput
    claimedBy?: UserCreateNestedOneWithoutClaimedInput
    createdBy?: UserCreateNestedOneWithoutCreatedGiftsInput
    wishlists?: WishlistCreateNestedManyWithoutGiftsInput
  }

  export type GiftUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    ownerId: string
    claimed?: boolean
    claimedById?: string | null
    createdById?: string | null
    wishlists?: WishlistUncheckedCreateNestedManyWithoutGiftsInput
  }

  export type GiftUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    claimed?: BoolFieldUpdateOperationsInput | boolean
    owner?: UserUpdateOneRequiredWithoutGiftsNestedInput
    claimedBy?: UserUpdateOneWithoutClaimedNestedInput
    createdBy?: UserUpdateOneWithoutCreatedGiftsNestedInput
    wishlists?: WishlistUpdateManyWithoutGiftsNestedInput
  }

  export type GiftUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: StringFieldUpdateOperationsInput | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    wishlists?: WishlistUncheckedUpdateManyWithoutGiftsNestedInput
  }

  export type GiftCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    ownerId: string
    claimed?: boolean
    claimedById?: string | null
    createdById?: string | null
  }

  export type GiftUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    claimed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GiftUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: StringFieldUpdateOperationsInput | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WishlistCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    password: string
    members?: UserCreateNestedManyWithoutWishlistsInput
    gifts?: GiftCreateNestedManyWithoutWishlistsInput
  }

  export type WishlistUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    password: string
    members?: UserUncheckedCreateNestedManyWithoutWishlistsInput
    gifts?: GiftUncheckedCreateNestedManyWithoutWishlistsInput
  }

  export type WishlistUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    members?: UserUpdateManyWithoutWishlistsNestedInput
    gifts?: GiftUpdateManyWithoutWishlistsNestedInput
  }

  export type WishlistUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    members?: UserUncheckedUpdateManyWithoutWishlistsNestedInput
    gifts?: GiftUncheckedUpdateManyWithoutWishlistsNestedInput
  }

  export type WishlistCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    password: string
  }

  export type WishlistUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type WishlistUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type SecretSantaEventCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedEventsInput
    participants?: SecretSantaParticipantCreateNestedManyWithoutEventInput
  }

  export type SecretSantaEventUncheckedCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
    participants?: SecretSantaParticipantUncheckedCreateNestedManyWithoutEventInput
  }

  export type SecretSantaEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedEventsNestedInput
    participants?: SecretSantaParticipantUpdateManyWithoutEventNestedInput
  }

  export type SecretSantaEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
    participants?: SecretSantaParticipantUncheckedUpdateManyWithoutEventNestedInput
  }

  export type SecretSantaEventCreateManyInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
  }

  export type SecretSantaEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecretSantaEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
  }

  export type SecretSantaParticipantCreateInput = {
    id?: string
    event: SecretSantaEventCreateNestedOneWithoutParticipantsInput
    user: UserCreateNestedOneWithoutSecretSantaParticipationsInput
    assignedTo?: UserCreateNestedOneWithoutSecretSantaAssignedToInput
    assignedBy?: UserCreateNestedOneWithoutSecretSantaAssignedByInput
  }

  export type SecretSantaParticipantUncheckedCreateInput = {
    id?: string
    eventId: string
    userId: string
    assignedToId?: string | null
    assignedById?: string | null
  }

  export type SecretSantaParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: SecretSantaEventUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneRequiredWithoutSecretSantaParticipationsNestedInput
    assignedTo?: UserUpdateOneWithoutSecretSantaAssignedToNestedInput
    assignedBy?: UserUpdateOneWithoutSecretSantaAssignedByNestedInput
  }

  export type SecretSantaParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SecretSantaParticipantCreateManyInput = {
    id?: string
    eventId: string
    userId: string
    assignedToId?: string | null
    assignedById?: string | null
  }

  export type SecretSantaParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type SecretSantaParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type GiftListRelationFilter = {
    every?: GiftWhereInput
    some?: GiftWhereInput
    none?: GiftWhereInput
  }

  export type WishlistListRelationFilter = {
    every?: WishlistWhereInput
    some?: WishlistWhereInput
    none?: WishlistWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type SecretSantaEventListRelationFilter = {
    every?: SecretSantaEventWhereInput
    some?: SecretSantaEventWhereInput
    none?: SecretSantaEventWhereInput
  }

  export type SecretSantaParticipantListRelationFilter = {
    every?: SecretSantaParticipantWhereInput
    some?: SecretSantaParticipantWhereInput
    none?: SecretSantaParticipantWhereInput
  }

  export type GiftOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WishlistOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SecretSantaEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SecretSantaParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    address?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    pant_size?: SortOrder
    shirt_size?: SortOrder
    shoe_size?: SortOrder
    hasCompletedOnboarding?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    address?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    pant_size?: SortOrder
    shirt_size?: SortOrder
    shoe_size?: SortOrder
    hasCompletedOnboarding?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    address?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    pant_size?: SortOrder
    shirt_size?: SortOrder
    shoe_size?: SortOrder
    hasCompletedOnboarding?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type GiftCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    image?: SortOrder
    url?: SortOrder
    description?: SortOrder
    published?: SortOrder
    ownerId?: SortOrder
    claimed?: SortOrder
    claimedById?: SortOrder
    createdById?: SortOrder
  }

  export type GiftMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    image?: SortOrder
    url?: SortOrder
    description?: SortOrder
    published?: SortOrder
    ownerId?: SortOrder
    claimed?: SortOrder
    claimedById?: SortOrder
    createdById?: SortOrder
  }

  export type GiftMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    image?: SortOrder
    url?: SortOrder
    description?: SortOrder
    published?: SortOrder
    ownerId?: SortOrder
    claimed?: SortOrder
    claimedById?: SortOrder
    createdById?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WishlistCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    password?: SortOrder
  }

  export type WishlistMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    password?: SortOrder
  }

  export type WishlistMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    password?: SortOrder
  }

  export type SecretSantaEventCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
  }

  export type SecretSantaEventMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
  }

  export type SecretSantaEventMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdById?: SortOrder
  }

  export type SecretSantaEventScalarRelationFilter = {
    is?: SecretSantaEventWhereInput
    isNot?: SecretSantaEventWhereInput
  }

  export type SecretSantaParticipantEventIdUserIdCompoundUniqueInput = {
    eventId: string
    userId: string
  }

  export type SecretSantaParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    assignedToId?: SortOrder
    assignedById?: SortOrder
  }

  export type SecretSantaParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    assignedToId?: SortOrder
    assignedById?: SortOrder
  }

  export type SecretSantaParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    eventId?: SortOrder
    userId?: SortOrder
    assignedToId?: SortOrder
    assignedById?: SortOrder
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type GiftCreateNestedManyWithoutOwnerInput = {
    create?: XOR<GiftCreateWithoutOwnerInput, GiftUncheckedCreateWithoutOwnerInput> | GiftCreateWithoutOwnerInput[] | GiftUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutOwnerInput | GiftCreateOrConnectWithoutOwnerInput[]
    createMany?: GiftCreateManyOwnerInputEnvelope
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
  }

  export type GiftCreateNestedManyWithoutClaimedByInput = {
    create?: XOR<GiftCreateWithoutClaimedByInput, GiftUncheckedCreateWithoutClaimedByInput> | GiftCreateWithoutClaimedByInput[] | GiftUncheckedCreateWithoutClaimedByInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutClaimedByInput | GiftCreateOrConnectWithoutClaimedByInput[]
    createMany?: GiftCreateManyClaimedByInputEnvelope
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
  }

  export type GiftCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<GiftCreateWithoutCreatedByInput, GiftUncheckedCreateWithoutCreatedByInput> | GiftCreateWithoutCreatedByInput[] | GiftUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutCreatedByInput | GiftCreateOrConnectWithoutCreatedByInput[]
    createMany?: GiftCreateManyCreatedByInputEnvelope
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
  }

  export type WishlistCreateNestedManyWithoutMembersInput = {
    create?: XOR<WishlistCreateWithoutMembersInput, WishlistUncheckedCreateWithoutMembersInput> | WishlistCreateWithoutMembersInput[] | WishlistUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: WishlistCreateOrConnectWithoutMembersInput | WishlistCreateOrConnectWithoutMembersInput[]
    connect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type SecretSantaEventCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<SecretSantaEventCreateWithoutCreatedByInput, SecretSantaEventUncheckedCreateWithoutCreatedByInput> | SecretSantaEventCreateWithoutCreatedByInput[] | SecretSantaEventUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: SecretSantaEventCreateOrConnectWithoutCreatedByInput | SecretSantaEventCreateOrConnectWithoutCreatedByInput[]
    createMany?: SecretSantaEventCreateManyCreatedByInputEnvelope
    connect?: SecretSantaEventWhereUniqueInput | SecretSantaEventWhereUniqueInput[]
  }

  export type SecretSantaParticipantCreateNestedManyWithoutUserInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutUserInput, SecretSantaParticipantUncheckedCreateWithoutUserInput> | SecretSantaParticipantCreateWithoutUserInput[] | SecretSantaParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutUserInput | SecretSantaParticipantCreateOrConnectWithoutUserInput[]
    createMany?: SecretSantaParticipantCreateManyUserInputEnvelope
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
  }

  export type SecretSantaParticipantCreateNestedManyWithoutAssignedToInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutAssignedToInput, SecretSantaParticipantUncheckedCreateWithoutAssignedToInput> | SecretSantaParticipantCreateWithoutAssignedToInput[] | SecretSantaParticipantUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutAssignedToInput | SecretSantaParticipantCreateOrConnectWithoutAssignedToInput[]
    createMany?: SecretSantaParticipantCreateManyAssignedToInputEnvelope
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
  }

  export type SecretSantaParticipantCreateNestedManyWithoutAssignedByInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutAssignedByInput, SecretSantaParticipantUncheckedCreateWithoutAssignedByInput> | SecretSantaParticipantCreateWithoutAssignedByInput[] | SecretSantaParticipantUncheckedCreateWithoutAssignedByInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutAssignedByInput | SecretSantaParticipantCreateOrConnectWithoutAssignedByInput[]
    createMany?: SecretSantaParticipantCreateManyAssignedByInputEnvelope
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
  }

  export type GiftUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<GiftCreateWithoutOwnerInput, GiftUncheckedCreateWithoutOwnerInput> | GiftCreateWithoutOwnerInput[] | GiftUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutOwnerInput | GiftCreateOrConnectWithoutOwnerInput[]
    createMany?: GiftCreateManyOwnerInputEnvelope
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
  }

  export type GiftUncheckedCreateNestedManyWithoutClaimedByInput = {
    create?: XOR<GiftCreateWithoutClaimedByInput, GiftUncheckedCreateWithoutClaimedByInput> | GiftCreateWithoutClaimedByInput[] | GiftUncheckedCreateWithoutClaimedByInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutClaimedByInput | GiftCreateOrConnectWithoutClaimedByInput[]
    createMany?: GiftCreateManyClaimedByInputEnvelope
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
  }

  export type GiftUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<GiftCreateWithoutCreatedByInput, GiftUncheckedCreateWithoutCreatedByInput> | GiftCreateWithoutCreatedByInput[] | GiftUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutCreatedByInput | GiftCreateOrConnectWithoutCreatedByInput[]
    createMany?: GiftCreateManyCreatedByInputEnvelope
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
  }

  export type WishlistUncheckedCreateNestedManyWithoutMembersInput = {
    create?: XOR<WishlistCreateWithoutMembersInput, WishlistUncheckedCreateWithoutMembersInput> | WishlistCreateWithoutMembersInput[] | WishlistUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: WishlistCreateOrConnectWithoutMembersInput | WishlistCreateOrConnectWithoutMembersInput[]
    connect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<SecretSantaEventCreateWithoutCreatedByInput, SecretSantaEventUncheckedCreateWithoutCreatedByInput> | SecretSantaEventCreateWithoutCreatedByInput[] | SecretSantaEventUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: SecretSantaEventCreateOrConnectWithoutCreatedByInput | SecretSantaEventCreateOrConnectWithoutCreatedByInput[]
    createMany?: SecretSantaEventCreateManyCreatedByInputEnvelope
    connect?: SecretSantaEventWhereUniqueInput | SecretSantaEventWhereUniqueInput[]
  }

  export type SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutUserInput, SecretSantaParticipantUncheckedCreateWithoutUserInput> | SecretSantaParticipantCreateWithoutUserInput[] | SecretSantaParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutUserInput | SecretSantaParticipantCreateOrConnectWithoutUserInput[]
    createMany?: SecretSantaParticipantCreateManyUserInputEnvelope
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
  }

  export type SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutAssignedToInput, SecretSantaParticipantUncheckedCreateWithoutAssignedToInput> | SecretSantaParticipantCreateWithoutAssignedToInput[] | SecretSantaParticipantUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutAssignedToInput | SecretSantaParticipantCreateOrConnectWithoutAssignedToInput[]
    createMany?: SecretSantaParticipantCreateManyAssignedToInputEnvelope
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
  }

  export type SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutAssignedByInput, SecretSantaParticipantUncheckedCreateWithoutAssignedByInput> | SecretSantaParticipantCreateWithoutAssignedByInput[] | SecretSantaParticipantUncheckedCreateWithoutAssignedByInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutAssignedByInput | SecretSantaParticipantCreateOrConnectWithoutAssignedByInput[]
    createMany?: SecretSantaParticipantCreateManyAssignedByInputEnvelope
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type GiftUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<GiftCreateWithoutOwnerInput, GiftUncheckedCreateWithoutOwnerInput> | GiftCreateWithoutOwnerInput[] | GiftUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutOwnerInput | GiftCreateOrConnectWithoutOwnerInput[]
    upsert?: GiftUpsertWithWhereUniqueWithoutOwnerInput | GiftUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: GiftCreateManyOwnerInputEnvelope
    set?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    disconnect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    delete?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    update?: GiftUpdateWithWhereUniqueWithoutOwnerInput | GiftUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: GiftUpdateManyWithWhereWithoutOwnerInput | GiftUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: GiftScalarWhereInput | GiftScalarWhereInput[]
  }

  export type GiftUpdateManyWithoutClaimedByNestedInput = {
    create?: XOR<GiftCreateWithoutClaimedByInput, GiftUncheckedCreateWithoutClaimedByInput> | GiftCreateWithoutClaimedByInput[] | GiftUncheckedCreateWithoutClaimedByInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutClaimedByInput | GiftCreateOrConnectWithoutClaimedByInput[]
    upsert?: GiftUpsertWithWhereUniqueWithoutClaimedByInput | GiftUpsertWithWhereUniqueWithoutClaimedByInput[]
    createMany?: GiftCreateManyClaimedByInputEnvelope
    set?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    disconnect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    delete?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    update?: GiftUpdateWithWhereUniqueWithoutClaimedByInput | GiftUpdateWithWhereUniqueWithoutClaimedByInput[]
    updateMany?: GiftUpdateManyWithWhereWithoutClaimedByInput | GiftUpdateManyWithWhereWithoutClaimedByInput[]
    deleteMany?: GiftScalarWhereInput | GiftScalarWhereInput[]
  }

  export type GiftUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<GiftCreateWithoutCreatedByInput, GiftUncheckedCreateWithoutCreatedByInput> | GiftCreateWithoutCreatedByInput[] | GiftUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutCreatedByInput | GiftCreateOrConnectWithoutCreatedByInput[]
    upsert?: GiftUpsertWithWhereUniqueWithoutCreatedByInput | GiftUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: GiftCreateManyCreatedByInputEnvelope
    set?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    disconnect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    delete?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    update?: GiftUpdateWithWhereUniqueWithoutCreatedByInput | GiftUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: GiftUpdateManyWithWhereWithoutCreatedByInput | GiftUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: GiftScalarWhereInput | GiftScalarWhereInput[]
  }

  export type WishlistUpdateManyWithoutMembersNestedInput = {
    create?: XOR<WishlistCreateWithoutMembersInput, WishlistUncheckedCreateWithoutMembersInput> | WishlistCreateWithoutMembersInput[] | WishlistUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: WishlistCreateOrConnectWithoutMembersInput | WishlistCreateOrConnectWithoutMembersInput[]
    upsert?: WishlistUpsertWithWhereUniqueWithoutMembersInput | WishlistUpsertWithWhereUniqueWithoutMembersInput[]
    set?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    disconnect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    delete?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    connect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    update?: WishlistUpdateWithWhereUniqueWithoutMembersInput | WishlistUpdateWithWhereUniqueWithoutMembersInput[]
    updateMany?: WishlistUpdateManyWithWhereWithoutMembersInput | WishlistUpdateManyWithWhereWithoutMembersInput[]
    deleteMany?: WishlistScalarWhereInput | WishlistScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type SecretSantaEventUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<SecretSantaEventCreateWithoutCreatedByInput, SecretSantaEventUncheckedCreateWithoutCreatedByInput> | SecretSantaEventCreateWithoutCreatedByInput[] | SecretSantaEventUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: SecretSantaEventCreateOrConnectWithoutCreatedByInput | SecretSantaEventCreateOrConnectWithoutCreatedByInput[]
    upsert?: SecretSantaEventUpsertWithWhereUniqueWithoutCreatedByInput | SecretSantaEventUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: SecretSantaEventCreateManyCreatedByInputEnvelope
    set?: SecretSantaEventWhereUniqueInput | SecretSantaEventWhereUniqueInput[]
    disconnect?: SecretSantaEventWhereUniqueInput | SecretSantaEventWhereUniqueInput[]
    delete?: SecretSantaEventWhereUniqueInput | SecretSantaEventWhereUniqueInput[]
    connect?: SecretSantaEventWhereUniqueInput | SecretSantaEventWhereUniqueInput[]
    update?: SecretSantaEventUpdateWithWhereUniqueWithoutCreatedByInput | SecretSantaEventUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: SecretSantaEventUpdateManyWithWhereWithoutCreatedByInput | SecretSantaEventUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: SecretSantaEventScalarWhereInput | SecretSantaEventScalarWhereInput[]
  }

  export type SecretSantaParticipantUpdateManyWithoutUserNestedInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutUserInput, SecretSantaParticipantUncheckedCreateWithoutUserInput> | SecretSantaParticipantCreateWithoutUserInput[] | SecretSantaParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutUserInput | SecretSantaParticipantCreateOrConnectWithoutUserInput[]
    upsert?: SecretSantaParticipantUpsertWithWhereUniqueWithoutUserInput | SecretSantaParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SecretSantaParticipantCreateManyUserInputEnvelope
    set?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    disconnect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    delete?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    update?: SecretSantaParticipantUpdateWithWhereUniqueWithoutUserInput | SecretSantaParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SecretSantaParticipantUpdateManyWithWhereWithoutUserInput | SecretSantaParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SecretSantaParticipantScalarWhereInput | SecretSantaParticipantScalarWhereInput[]
  }

  export type SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutAssignedToInput, SecretSantaParticipantUncheckedCreateWithoutAssignedToInput> | SecretSantaParticipantCreateWithoutAssignedToInput[] | SecretSantaParticipantUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutAssignedToInput | SecretSantaParticipantCreateOrConnectWithoutAssignedToInput[]
    upsert?: SecretSantaParticipantUpsertWithWhereUniqueWithoutAssignedToInput | SecretSantaParticipantUpsertWithWhereUniqueWithoutAssignedToInput[]
    createMany?: SecretSantaParticipantCreateManyAssignedToInputEnvelope
    set?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    disconnect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    delete?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    update?: SecretSantaParticipantUpdateWithWhereUniqueWithoutAssignedToInput | SecretSantaParticipantUpdateWithWhereUniqueWithoutAssignedToInput[]
    updateMany?: SecretSantaParticipantUpdateManyWithWhereWithoutAssignedToInput | SecretSantaParticipantUpdateManyWithWhereWithoutAssignedToInput[]
    deleteMany?: SecretSantaParticipantScalarWhereInput | SecretSantaParticipantScalarWhereInput[]
  }

  export type SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutAssignedByInput, SecretSantaParticipantUncheckedCreateWithoutAssignedByInput> | SecretSantaParticipantCreateWithoutAssignedByInput[] | SecretSantaParticipantUncheckedCreateWithoutAssignedByInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutAssignedByInput | SecretSantaParticipantCreateOrConnectWithoutAssignedByInput[]
    upsert?: SecretSantaParticipantUpsertWithWhereUniqueWithoutAssignedByInput | SecretSantaParticipantUpsertWithWhereUniqueWithoutAssignedByInput[]
    createMany?: SecretSantaParticipantCreateManyAssignedByInputEnvelope
    set?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    disconnect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    delete?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    update?: SecretSantaParticipantUpdateWithWhereUniqueWithoutAssignedByInput | SecretSantaParticipantUpdateWithWhereUniqueWithoutAssignedByInput[]
    updateMany?: SecretSantaParticipantUpdateManyWithWhereWithoutAssignedByInput | SecretSantaParticipantUpdateManyWithWhereWithoutAssignedByInput[]
    deleteMany?: SecretSantaParticipantScalarWhereInput | SecretSantaParticipantScalarWhereInput[]
  }

  export type GiftUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<GiftCreateWithoutOwnerInput, GiftUncheckedCreateWithoutOwnerInput> | GiftCreateWithoutOwnerInput[] | GiftUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutOwnerInput | GiftCreateOrConnectWithoutOwnerInput[]
    upsert?: GiftUpsertWithWhereUniqueWithoutOwnerInput | GiftUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: GiftCreateManyOwnerInputEnvelope
    set?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    disconnect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    delete?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    update?: GiftUpdateWithWhereUniqueWithoutOwnerInput | GiftUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: GiftUpdateManyWithWhereWithoutOwnerInput | GiftUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: GiftScalarWhereInput | GiftScalarWhereInput[]
  }

  export type GiftUncheckedUpdateManyWithoutClaimedByNestedInput = {
    create?: XOR<GiftCreateWithoutClaimedByInput, GiftUncheckedCreateWithoutClaimedByInput> | GiftCreateWithoutClaimedByInput[] | GiftUncheckedCreateWithoutClaimedByInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutClaimedByInput | GiftCreateOrConnectWithoutClaimedByInput[]
    upsert?: GiftUpsertWithWhereUniqueWithoutClaimedByInput | GiftUpsertWithWhereUniqueWithoutClaimedByInput[]
    createMany?: GiftCreateManyClaimedByInputEnvelope
    set?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    disconnect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    delete?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    update?: GiftUpdateWithWhereUniqueWithoutClaimedByInput | GiftUpdateWithWhereUniqueWithoutClaimedByInput[]
    updateMany?: GiftUpdateManyWithWhereWithoutClaimedByInput | GiftUpdateManyWithWhereWithoutClaimedByInput[]
    deleteMany?: GiftScalarWhereInput | GiftScalarWhereInput[]
  }

  export type GiftUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<GiftCreateWithoutCreatedByInput, GiftUncheckedCreateWithoutCreatedByInput> | GiftCreateWithoutCreatedByInput[] | GiftUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutCreatedByInput | GiftCreateOrConnectWithoutCreatedByInput[]
    upsert?: GiftUpsertWithWhereUniqueWithoutCreatedByInput | GiftUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: GiftCreateManyCreatedByInputEnvelope
    set?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    disconnect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    delete?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    update?: GiftUpdateWithWhereUniqueWithoutCreatedByInput | GiftUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: GiftUpdateManyWithWhereWithoutCreatedByInput | GiftUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: GiftScalarWhereInput | GiftScalarWhereInput[]
  }

  export type WishlistUncheckedUpdateManyWithoutMembersNestedInput = {
    create?: XOR<WishlistCreateWithoutMembersInput, WishlistUncheckedCreateWithoutMembersInput> | WishlistCreateWithoutMembersInput[] | WishlistUncheckedCreateWithoutMembersInput[]
    connectOrCreate?: WishlistCreateOrConnectWithoutMembersInput | WishlistCreateOrConnectWithoutMembersInput[]
    upsert?: WishlistUpsertWithWhereUniqueWithoutMembersInput | WishlistUpsertWithWhereUniqueWithoutMembersInput[]
    set?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    disconnect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    delete?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    connect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    update?: WishlistUpdateWithWhereUniqueWithoutMembersInput | WishlistUpdateWithWhereUniqueWithoutMembersInput[]
    updateMany?: WishlistUpdateManyWithWhereWithoutMembersInput | WishlistUpdateManyWithWhereWithoutMembersInput[]
    deleteMany?: WishlistScalarWhereInput | WishlistScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<SecretSantaEventCreateWithoutCreatedByInput, SecretSantaEventUncheckedCreateWithoutCreatedByInput> | SecretSantaEventCreateWithoutCreatedByInput[] | SecretSantaEventUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: SecretSantaEventCreateOrConnectWithoutCreatedByInput | SecretSantaEventCreateOrConnectWithoutCreatedByInput[]
    upsert?: SecretSantaEventUpsertWithWhereUniqueWithoutCreatedByInput | SecretSantaEventUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: SecretSantaEventCreateManyCreatedByInputEnvelope
    set?: SecretSantaEventWhereUniqueInput | SecretSantaEventWhereUniqueInput[]
    disconnect?: SecretSantaEventWhereUniqueInput | SecretSantaEventWhereUniqueInput[]
    delete?: SecretSantaEventWhereUniqueInput | SecretSantaEventWhereUniqueInput[]
    connect?: SecretSantaEventWhereUniqueInput | SecretSantaEventWhereUniqueInput[]
    update?: SecretSantaEventUpdateWithWhereUniqueWithoutCreatedByInput | SecretSantaEventUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: SecretSantaEventUpdateManyWithWhereWithoutCreatedByInput | SecretSantaEventUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: SecretSantaEventScalarWhereInput | SecretSantaEventScalarWhereInput[]
  }

  export type SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutUserInput, SecretSantaParticipantUncheckedCreateWithoutUserInput> | SecretSantaParticipantCreateWithoutUserInput[] | SecretSantaParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutUserInput | SecretSantaParticipantCreateOrConnectWithoutUserInput[]
    upsert?: SecretSantaParticipantUpsertWithWhereUniqueWithoutUserInput | SecretSantaParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SecretSantaParticipantCreateManyUserInputEnvelope
    set?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    disconnect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    delete?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    update?: SecretSantaParticipantUpdateWithWhereUniqueWithoutUserInput | SecretSantaParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SecretSantaParticipantUpdateManyWithWhereWithoutUserInput | SecretSantaParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SecretSantaParticipantScalarWhereInput | SecretSantaParticipantScalarWhereInput[]
  }

  export type SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutAssignedToInput, SecretSantaParticipantUncheckedCreateWithoutAssignedToInput> | SecretSantaParticipantCreateWithoutAssignedToInput[] | SecretSantaParticipantUncheckedCreateWithoutAssignedToInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutAssignedToInput | SecretSantaParticipantCreateOrConnectWithoutAssignedToInput[]
    upsert?: SecretSantaParticipantUpsertWithWhereUniqueWithoutAssignedToInput | SecretSantaParticipantUpsertWithWhereUniqueWithoutAssignedToInput[]
    createMany?: SecretSantaParticipantCreateManyAssignedToInputEnvelope
    set?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    disconnect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    delete?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    update?: SecretSantaParticipantUpdateWithWhereUniqueWithoutAssignedToInput | SecretSantaParticipantUpdateWithWhereUniqueWithoutAssignedToInput[]
    updateMany?: SecretSantaParticipantUpdateManyWithWhereWithoutAssignedToInput | SecretSantaParticipantUpdateManyWithWhereWithoutAssignedToInput[]
    deleteMany?: SecretSantaParticipantScalarWhereInput | SecretSantaParticipantScalarWhereInput[]
  }

  export type SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutAssignedByInput, SecretSantaParticipantUncheckedCreateWithoutAssignedByInput> | SecretSantaParticipantCreateWithoutAssignedByInput[] | SecretSantaParticipantUncheckedCreateWithoutAssignedByInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutAssignedByInput | SecretSantaParticipantCreateOrConnectWithoutAssignedByInput[]
    upsert?: SecretSantaParticipantUpsertWithWhereUniqueWithoutAssignedByInput | SecretSantaParticipantUpsertWithWhereUniqueWithoutAssignedByInput[]
    createMany?: SecretSantaParticipantCreateManyAssignedByInputEnvelope
    set?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    disconnect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    delete?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    update?: SecretSantaParticipantUpdateWithWhereUniqueWithoutAssignedByInput | SecretSantaParticipantUpdateWithWhereUniqueWithoutAssignedByInput[]
    updateMany?: SecretSantaParticipantUpdateManyWithWhereWithoutAssignedByInput | SecretSantaParticipantUpdateManyWithWhereWithoutAssignedByInput[]
    deleteMany?: SecretSantaParticipantScalarWhereInput | SecretSantaParticipantScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutGiftsInput = {
    create?: XOR<UserCreateWithoutGiftsInput, UserUncheckedCreateWithoutGiftsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGiftsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutClaimedInput = {
    create?: XOR<UserCreateWithoutClaimedInput, UserUncheckedCreateWithoutClaimedInput>
    connectOrCreate?: UserCreateOrConnectWithoutClaimedInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCreatedGiftsInput = {
    create?: XOR<UserCreateWithoutCreatedGiftsInput, UserUncheckedCreateWithoutCreatedGiftsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedGiftsInput
    connect?: UserWhereUniqueInput
  }

  export type WishlistCreateNestedManyWithoutGiftsInput = {
    create?: XOR<WishlistCreateWithoutGiftsInput, WishlistUncheckedCreateWithoutGiftsInput> | WishlistCreateWithoutGiftsInput[] | WishlistUncheckedCreateWithoutGiftsInput[]
    connectOrCreate?: WishlistCreateOrConnectWithoutGiftsInput | WishlistCreateOrConnectWithoutGiftsInput[]
    connect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
  }

  export type WishlistUncheckedCreateNestedManyWithoutGiftsInput = {
    create?: XOR<WishlistCreateWithoutGiftsInput, WishlistUncheckedCreateWithoutGiftsInput> | WishlistCreateWithoutGiftsInput[] | WishlistUncheckedCreateWithoutGiftsInput[]
    connectOrCreate?: WishlistCreateOrConnectWithoutGiftsInput | WishlistCreateOrConnectWithoutGiftsInput[]
    connect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutGiftsNestedInput = {
    create?: XOR<UserCreateWithoutGiftsInput, UserUncheckedCreateWithoutGiftsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGiftsInput
    upsert?: UserUpsertWithoutGiftsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGiftsInput, UserUpdateWithoutGiftsInput>, UserUncheckedUpdateWithoutGiftsInput>
  }

  export type UserUpdateOneWithoutClaimedNestedInput = {
    create?: XOR<UserCreateWithoutClaimedInput, UserUncheckedCreateWithoutClaimedInput>
    connectOrCreate?: UserCreateOrConnectWithoutClaimedInput
    upsert?: UserUpsertWithoutClaimedInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutClaimedInput, UserUpdateWithoutClaimedInput>, UserUncheckedUpdateWithoutClaimedInput>
  }

  export type UserUpdateOneWithoutCreatedGiftsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedGiftsInput, UserUncheckedCreateWithoutCreatedGiftsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedGiftsInput
    upsert?: UserUpsertWithoutCreatedGiftsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedGiftsInput, UserUpdateWithoutCreatedGiftsInput>, UserUncheckedUpdateWithoutCreatedGiftsInput>
  }

  export type WishlistUpdateManyWithoutGiftsNestedInput = {
    create?: XOR<WishlistCreateWithoutGiftsInput, WishlistUncheckedCreateWithoutGiftsInput> | WishlistCreateWithoutGiftsInput[] | WishlistUncheckedCreateWithoutGiftsInput[]
    connectOrCreate?: WishlistCreateOrConnectWithoutGiftsInput | WishlistCreateOrConnectWithoutGiftsInput[]
    upsert?: WishlistUpsertWithWhereUniqueWithoutGiftsInput | WishlistUpsertWithWhereUniqueWithoutGiftsInput[]
    set?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    disconnect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    delete?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    connect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    update?: WishlistUpdateWithWhereUniqueWithoutGiftsInput | WishlistUpdateWithWhereUniqueWithoutGiftsInput[]
    updateMany?: WishlistUpdateManyWithWhereWithoutGiftsInput | WishlistUpdateManyWithWhereWithoutGiftsInput[]
    deleteMany?: WishlistScalarWhereInput | WishlistScalarWhereInput[]
  }

  export type WishlistUncheckedUpdateManyWithoutGiftsNestedInput = {
    create?: XOR<WishlistCreateWithoutGiftsInput, WishlistUncheckedCreateWithoutGiftsInput> | WishlistCreateWithoutGiftsInput[] | WishlistUncheckedCreateWithoutGiftsInput[]
    connectOrCreate?: WishlistCreateOrConnectWithoutGiftsInput | WishlistCreateOrConnectWithoutGiftsInput[]
    upsert?: WishlistUpsertWithWhereUniqueWithoutGiftsInput | WishlistUpsertWithWhereUniqueWithoutGiftsInput[]
    set?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    disconnect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    delete?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    connect?: WishlistWhereUniqueInput | WishlistWhereUniqueInput[]
    update?: WishlistUpdateWithWhereUniqueWithoutGiftsInput | WishlistUpdateWithWhereUniqueWithoutGiftsInput[]
    updateMany?: WishlistUpdateManyWithWhereWithoutGiftsInput | WishlistUpdateManyWithWhereWithoutGiftsInput[]
    deleteMany?: WishlistScalarWhereInput | WishlistScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutWishlistsInput = {
    create?: XOR<UserCreateWithoutWishlistsInput, UserUncheckedCreateWithoutWishlistsInput> | UserCreateWithoutWishlistsInput[] | UserUncheckedCreateWithoutWishlistsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWishlistsInput | UserCreateOrConnectWithoutWishlistsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type GiftCreateNestedManyWithoutWishlistsInput = {
    create?: XOR<GiftCreateWithoutWishlistsInput, GiftUncheckedCreateWithoutWishlistsInput> | GiftCreateWithoutWishlistsInput[] | GiftUncheckedCreateWithoutWishlistsInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutWishlistsInput | GiftCreateOrConnectWithoutWishlistsInput[]
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutWishlistsInput = {
    create?: XOR<UserCreateWithoutWishlistsInput, UserUncheckedCreateWithoutWishlistsInput> | UserCreateWithoutWishlistsInput[] | UserUncheckedCreateWithoutWishlistsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWishlistsInput | UserCreateOrConnectWithoutWishlistsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type GiftUncheckedCreateNestedManyWithoutWishlistsInput = {
    create?: XOR<GiftCreateWithoutWishlistsInput, GiftUncheckedCreateWithoutWishlistsInput> | GiftCreateWithoutWishlistsInput[] | GiftUncheckedCreateWithoutWishlistsInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutWishlistsInput | GiftCreateOrConnectWithoutWishlistsInput[]
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutWishlistsNestedInput = {
    create?: XOR<UserCreateWithoutWishlistsInput, UserUncheckedCreateWithoutWishlistsInput> | UserCreateWithoutWishlistsInput[] | UserUncheckedCreateWithoutWishlistsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWishlistsInput | UserCreateOrConnectWithoutWishlistsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutWishlistsInput | UserUpsertWithWhereUniqueWithoutWishlistsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutWishlistsInput | UserUpdateWithWhereUniqueWithoutWishlistsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutWishlistsInput | UserUpdateManyWithWhereWithoutWishlistsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type GiftUpdateManyWithoutWishlistsNestedInput = {
    create?: XOR<GiftCreateWithoutWishlistsInput, GiftUncheckedCreateWithoutWishlistsInput> | GiftCreateWithoutWishlistsInput[] | GiftUncheckedCreateWithoutWishlistsInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutWishlistsInput | GiftCreateOrConnectWithoutWishlistsInput[]
    upsert?: GiftUpsertWithWhereUniqueWithoutWishlistsInput | GiftUpsertWithWhereUniqueWithoutWishlistsInput[]
    set?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    disconnect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    delete?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    update?: GiftUpdateWithWhereUniqueWithoutWishlistsInput | GiftUpdateWithWhereUniqueWithoutWishlistsInput[]
    updateMany?: GiftUpdateManyWithWhereWithoutWishlistsInput | GiftUpdateManyWithWhereWithoutWishlistsInput[]
    deleteMany?: GiftScalarWhereInput | GiftScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutWishlistsNestedInput = {
    create?: XOR<UserCreateWithoutWishlistsInput, UserUncheckedCreateWithoutWishlistsInput> | UserCreateWithoutWishlistsInput[] | UserUncheckedCreateWithoutWishlistsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWishlistsInput | UserCreateOrConnectWithoutWishlistsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutWishlistsInput | UserUpsertWithWhereUniqueWithoutWishlistsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutWishlistsInput | UserUpdateWithWhereUniqueWithoutWishlistsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutWishlistsInput | UserUpdateManyWithWhereWithoutWishlistsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type GiftUncheckedUpdateManyWithoutWishlistsNestedInput = {
    create?: XOR<GiftCreateWithoutWishlistsInput, GiftUncheckedCreateWithoutWishlistsInput> | GiftCreateWithoutWishlistsInput[] | GiftUncheckedCreateWithoutWishlistsInput[]
    connectOrCreate?: GiftCreateOrConnectWithoutWishlistsInput | GiftCreateOrConnectWithoutWishlistsInput[]
    upsert?: GiftUpsertWithWhereUniqueWithoutWishlistsInput | GiftUpsertWithWhereUniqueWithoutWishlistsInput[]
    set?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    disconnect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    delete?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    connect?: GiftWhereUniqueInput | GiftWhereUniqueInput[]
    update?: GiftUpdateWithWhereUniqueWithoutWishlistsInput | GiftUpdateWithWhereUniqueWithoutWishlistsInput[]
    updateMany?: GiftUpdateManyWithWhereWithoutWishlistsInput | GiftUpdateManyWithWhereWithoutWishlistsInput[]
    deleteMany?: GiftScalarWhereInput | GiftScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCreatedEventsInput = {
    create?: XOR<UserCreateWithoutCreatedEventsInput, UserUncheckedCreateWithoutCreatedEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedEventsInput
    connect?: UserWhereUniqueInput
  }

  export type SecretSantaParticipantCreateNestedManyWithoutEventInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutEventInput, SecretSantaParticipantUncheckedCreateWithoutEventInput> | SecretSantaParticipantCreateWithoutEventInput[] | SecretSantaParticipantUncheckedCreateWithoutEventInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutEventInput | SecretSantaParticipantCreateOrConnectWithoutEventInput[]
    createMany?: SecretSantaParticipantCreateManyEventInputEnvelope
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
  }

  export type SecretSantaParticipantUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutEventInput, SecretSantaParticipantUncheckedCreateWithoutEventInput> | SecretSantaParticipantCreateWithoutEventInput[] | SecretSantaParticipantUncheckedCreateWithoutEventInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutEventInput | SecretSantaParticipantCreateOrConnectWithoutEventInput[]
    createMany?: SecretSantaParticipantCreateManyEventInputEnvelope
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutCreatedEventsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedEventsInput, UserUncheckedCreateWithoutCreatedEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedEventsInput
    upsert?: UserUpsertWithoutCreatedEventsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedEventsInput, UserUpdateWithoutCreatedEventsInput>, UserUncheckedUpdateWithoutCreatedEventsInput>
  }

  export type SecretSantaParticipantUpdateManyWithoutEventNestedInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutEventInput, SecretSantaParticipantUncheckedCreateWithoutEventInput> | SecretSantaParticipantCreateWithoutEventInput[] | SecretSantaParticipantUncheckedCreateWithoutEventInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutEventInput | SecretSantaParticipantCreateOrConnectWithoutEventInput[]
    upsert?: SecretSantaParticipantUpsertWithWhereUniqueWithoutEventInput | SecretSantaParticipantUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: SecretSantaParticipantCreateManyEventInputEnvelope
    set?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    disconnect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    delete?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    update?: SecretSantaParticipantUpdateWithWhereUniqueWithoutEventInput | SecretSantaParticipantUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: SecretSantaParticipantUpdateManyWithWhereWithoutEventInput | SecretSantaParticipantUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: SecretSantaParticipantScalarWhereInput | SecretSantaParticipantScalarWhereInput[]
  }

  export type SecretSantaParticipantUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<SecretSantaParticipantCreateWithoutEventInput, SecretSantaParticipantUncheckedCreateWithoutEventInput> | SecretSantaParticipantCreateWithoutEventInput[] | SecretSantaParticipantUncheckedCreateWithoutEventInput[]
    connectOrCreate?: SecretSantaParticipantCreateOrConnectWithoutEventInput | SecretSantaParticipantCreateOrConnectWithoutEventInput[]
    upsert?: SecretSantaParticipantUpsertWithWhereUniqueWithoutEventInput | SecretSantaParticipantUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: SecretSantaParticipantCreateManyEventInputEnvelope
    set?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    disconnect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    delete?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    connect?: SecretSantaParticipantWhereUniqueInput | SecretSantaParticipantWhereUniqueInput[]
    update?: SecretSantaParticipantUpdateWithWhereUniqueWithoutEventInput | SecretSantaParticipantUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: SecretSantaParticipantUpdateManyWithWhereWithoutEventInput | SecretSantaParticipantUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: SecretSantaParticipantScalarWhereInput | SecretSantaParticipantScalarWhereInput[]
  }

  export type SecretSantaEventCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<SecretSantaEventCreateWithoutParticipantsInput, SecretSantaEventUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: SecretSantaEventCreateOrConnectWithoutParticipantsInput
    connect?: SecretSantaEventWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSecretSantaParticipationsInput = {
    create?: XOR<UserCreateWithoutSecretSantaParticipationsInput, UserUncheckedCreateWithoutSecretSantaParticipationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSecretSantaParticipationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSecretSantaAssignedToInput = {
    create?: XOR<UserCreateWithoutSecretSantaAssignedToInput, UserUncheckedCreateWithoutSecretSantaAssignedToInput>
    connectOrCreate?: UserCreateOrConnectWithoutSecretSantaAssignedToInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSecretSantaAssignedByInput = {
    create?: XOR<UserCreateWithoutSecretSantaAssignedByInput, UserUncheckedCreateWithoutSecretSantaAssignedByInput>
    connectOrCreate?: UserCreateOrConnectWithoutSecretSantaAssignedByInput
    connect?: UserWhereUniqueInput
  }

  export type SecretSantaEventUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<SecretSantaEventCreateWithoutParticipantsInput, SecretSantaEventUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: SecretSantaEventCreateOrConnectWithoutParticipantsInput
    upsert?: SecretSantaEventUpsertWithoutParticipantsInput
    connect?: SecretSantaEventWhereUniqueInput
    update?: XOR<XOR<SecretSantaEventUpdateToOneWithWhereWithoutParticipantsInput, SecretSantaEventUpdateWithoutParticipantsInput>, SecretSantaEventUncheckedUpdateWithoutParticipantsInput>
  }

  export type UserUpdateOneRequiredWithoutSecretSantaParticipationsNestedInput = {
    create?: XOR<UserCreateWithoutSecretSantaParticipationsInput, UserUncheckedCreateWithoutSecretSantaParticipationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSecretSantaParticipationsInput
    upsert?: UserUpsertWithoutSecretSantaParticipationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSecretSantaParticipationsInput, UserUpdateWithoutSecretSantaParticipationsInput>, UserUncheckedUpdateWithoutSecretSantaParticipationsInput>
  }

  export type UserUpdateOneWithoutSecretSantaAssignedToNestedInput = {
    create?: XOR<UserCreateWithoutSecretSantaAssignedToInput, UserUncheckedCreateWithoutSecretSantaAssignedToInput>
    connectOrCreate?: UserCreateOrConnectWithoutSecretSantaAssignedToInput
    upsert?: UserUpsertWithoutSecretSantaAssignedToInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSecretSantaAssignedToInput, UserUpdateWithoutSecretSantaAssignedToInput>, UserUncheckedUpdateWithoutSecretSantaAssignedToInput>
  }

  export type UserUpdateOneWithoutSecretSantaAssignedByNestedInput = {
    create?: XOR<UserCreateWithoutSecretSantaAssignedByInput, UserUncheckedCreateWithoutSecretSantaAssignedByInput>
    connectOrCreate?: UserCreateOrConnectWithoutSecretSantaAssignedByInput
    upsert?: UserUpsertWithoutSecretSantaAssignedByInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSecretSantaAssignedByInput, UserUpdateWithoutSecretSantaAssignedByInput>, UserUncheckedUpdateWithoutSecretSantaAssignedByInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftCreateNestedManyWithoutOwnerInput
    claimed?: GiftCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistCreateNestedManyWithoutMembersInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantCreateNestedManyWithoutAssignedByInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftUncheckedCreateNestedManyWithoutOwnerInput
    claimed?: GiftUncheckedCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftUncheckedCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistUncheckedCreateNestedManyWithoutMembersInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUpdateManyWithoutMembersNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUncheckedUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUncheckedUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUncheckedUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUncheckedUpdateManyWithoutMembersNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftCreateNestedManyWithoutOwnerInput
    claimed?: GiftCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistCreateNestedManyWithoutMembersInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantCreateNestedManyWithoutAssignedByInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftUncheckedCreateNestedManyWithoutOwnerInput
    claimed?: GiftUncheckedCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftUncheckedCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistUncheckedCreateNestedManyWithoutMembersInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUpdateManyWithoutMembersNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUncheckedUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUncheckedUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUncheckedUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUncheckedUpdateManyWithoutMembersNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput
  }

  export type GiftCreateWithoutOwnerInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    claimed?: boolean
    claimedBy?: UserCreateNestedOneWithoutClaimedInput
    createdBy?: UserCreateNestedOneWithoutCreatedGiftsInput
    wishlists?: WishlistCreateNestedManyWithoutGiftsInput
  }

  export type GiftUncheckedCreateWithoutOwnerInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    claimed?: boolean
    claimedById?: string | null
    createdById?: string | null
    wishlists?: WishlistUncheckedCreateNestedManyWithoutGiftsInput
  }

  export type GiftCreateOrConnectWithoutOwnerInput = {
    where: GiftWhereUniqueInput
    create: XOR<GiftCreateWithoutOwnerInput, GiftUncheckedCreateWithoutOwnerInput>
  }

  export type GiftCreateManyOwnerInputEnvelope = {
    data: GiftCreateManyOwnerInput | GiftCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type GiftCreateWithoutClaimedByInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    claimed?: boolean
    owner: UserCreateNestedOneWithoutGiftsInput
    createdBy?: UserCreateNestedOneWithoutCreatedGiftsInput
    wishlists?: WishlistCreateNestedManyWithoutGiftsInput
  }

  export type GiftUncheckedCreateWithoutClaimedByInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    ownerId: string
    claimed?: boolean
    createdById?: string | null
    wishlists?: WishlistUncheckedCreateNestedManyWithoutGiftsInput
  }

  export type GiftCreateOrConnectWithoutClaimedByInput = {
    where: GiftWhereUniqueInput
    create: XOR<GiftCreateWithoutClaimedByInput, GiftUncheckedCreateWithoutClaimedByInput>
  }

  export type GiftCreateManyClaimedByInputEnvelope = {
    data: GiftCreateManyClaimedByInput | GiftCreateManyClaimedByInput[]
    skipDuplicates?: boolean
  }

  export type GiftCreateWithoutCreatedByInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    claimed?: boolean
    owner: UserCreateNestedOneWithoutGiftsInput
    claimedBy?: UserCreateNestedOneWithoutClaimedInput
    wishlists?: WishlistCreateNestedManyWithoutGiftsInput
  }

  export type GiftUncheckedCreateWithoutCreatedByInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    ownerId: string
    claimed?: boolean
    claimedById?: string | null
    wishlists?: WishlistUncheckedCreateNestedManyWithoutGiftsInput
  }

  export type GiftCreateOrConnectWithoutCreatedByInput = {
    where: GiftWhereUniqueInput
    create: XOR<GiftCreateWithoutCreatedByInput, GiftUncheckedCreateWithoutCreatedByInput>
  }

  export type GiftCreateManyCreatedByInputEnvelope = {
    data: GiftCreateManyCreatedByInput | GiftCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type WishlistCreateWithoutMembersInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    password: string
    gifts?: GiftCreateNestedManyWithoutWishlistsInput
  }

  export type WishlistUncheckedCreateWithoutMembersInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    password: string
    gifts?: GiftUncheckedCreateNestedManyWithoutWishlistsInput
  }

  export type WishlistCreateOrConnectWithoutMembersInput = {
    where: WishlistWhereUniqueInput
    create: XOR<WishlistCreateWithoutMembersInput, WishlistUncheckedCreateWithoutMembersInput>
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SecretSantaEventCreateWithoutCreatedByInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: SecretSantaParticipantCreateNestedManyWithoutEventInput
  }

  export type SecretSantaEventUncheckedCreateWithoutCreatedByInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: SecretSantaParticipantUncheckedCreateNestedManyWithoutEventInput
  }

  export type SecretSantaEventCreateOrConnectWithoutCreatedByInput = {
    where: SecretSantaEventWhereUniqueInput
    create: XOR<SecretSantaEventCreateWithoutCreatedByInput, SecretSantaEventUncheckedCreateWithoutCreatedByInput>
  }

  export type SecretSantaEventCreateManyCreatedByInputEnvelope = {
    data: SecretSantaEventCreateManyCreatedByInput | SecretSantaEventCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type SecretSantaParticipantCreateWithoutUserInput = {
    id?: string
    event: SecretSantaEventCreateNestedOneWithoutParticipantsInput
    assignedTo?: UserCreateNestedOneWithoutSecretSantaAssignedToInput
    assignedBy?: UserCreateNestedOneWithoutSecretSantaAssignedByInput
  }

  export type SecretSantaParticipantUncheckedCreateWithoutUserInput = {
    id?: string
    eventId: string
    assignedToId?: string | null
    assignedById?: string | null
  }

  export type SecretSantaParticipantCreateOrConnectWithoutUserInput = {
    where: SecretSantaParticipantWhereUniqueInput
    create: XOR<SecretSantaParticipantCreateWithoutUserInput, SecretSantaParticipantUncheckedCreateWithoutUserInput>
  }

  export type SecretSantaParticipantCreateManyUserInputEnvelope = {
    data: SecretSantaParticipantCreateManyUserInput | SecretSantaParticipantCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SecretSantaParticipantCreateWithoutAssignedToInput = {
    id?: string
    event: SecretSantaEventCreateNestedOneWithoutParticipantsInput
    user: UserCreateNestedOneWithoutSecretSantaParticipationsInput
    assignedBy?: UserCreateNestedOneWithoutSecretSantaAssignedByInput
  }

  export type SecretSantaParticipantUncheckedCreateWithoutAssignedToInput = {
    id?: string
    eventId: string
    userId: string
    assignedById?: string | null
  }

  export type SecretSantaParticipantCreateOrConnectWithoutAssignedToInput = {
    where: SecretSantaParticipantWhereUniqueInput
    create: XOR<SecretSantaParticipantCreateWithoutAssignedToInput, SecretSantaParticipantUncheckedCreateWithoutAssignedToInput>
  }

  export type SecretSantaParticipantCreateManyAssignedToInputEnvelope = {
    data: SecretSantaParticipantCreateManyAssignedToInput | SecretSantaParticipantCreateManyAssignedToInput[]
    skipDuplicates?: boolean
  }

  export type SecretSantaParticipantCreateWithoutAssignedByInput = {
    id?: string
    event: SecretSantaEventCreateNestedOneWithoutParticipantsInput
    user: UserCreateNestedOneWithoutSecretSantaParticipationsInput
    assignedTo?: UserCreateNestedOneWithoutSecretSantaAssignedToInput
  }

  export type SecretSantaParticipantUncheckedCreateWithoutAssignedByInput = {
    id?: string
    eventId: string
    userId: string
    assignedToId?: string | null
  }

  export type SecretSantaParticipantCreateOrConnectWithoutAssignedByInput = {
    where: SecretSantaParticipantWhereUniqueInput
    create: XOR<SecretSantaParticipantCreateWithoutAssignedByInput, SecretSantaParticipantUncheckedCreateWithoutAssignedByInput>
  }

  export type SecretSantaParticipantCreateManyAssignedByInputEnvelope = {
    data: SecretSantaParticipantCreateManyAssignedByInput | SecretSantaParticipantCreateManyAssignedByInput[]
    skipDuplicates?: boolean
  }

  export type GiftUpsertWithWhereUniqueWithoutOwnerInput = {
    where: GiftWhereUniqueInput
    update: XOR<GiftUpdateWithoutOwnerInput, GiftUncheckedUpdateWithoutOwnerInput>
    create: XOR<GiftCreateWithoutOwnerInput, GiftUncheckedCreateWithoutOwnerInput>
  }

  export type GiftUpdateWithWhereUniqueWithoutOwnerInput = {
    where: GiftWhereUniqueInput
    data: XOR<GiftUpdateWithoutOwnerInput, GiftUncheckedUpdateWithoutOwnerInput>
  }

  export type GiftUpdateManyWithWhereWithoutOwnerInput = {
    where: GiftScalarWhereInput
    data: XOR<GiftUpdateManyMutationInput, GiftUncheckedUpdateManyWithoutOwnerInput>
  }

  export type GiftScalarWhereInput = {
    AND?: GiftScalarWhereInput | GiftScalarWhereInput[]
    OR?: GiftScalarWhereInput[]
    NOT?: GiftScalarWhereInput | GiftScalarWhereInput[]
    id?: UuidFilter<"Gift"> | string
    createdAt?: DateTimeFilter<"Gift"> | Date | string
    updatedAt?: DateTimeFilter<"Gift"> | Date | string
    name?: StringFilter<"Gift"> | string
    image?: StringNullableFilter<"Gift"> | string | null
    url?: StringNullableFilter<"Gift"> | string | null
    description?: StringNullableFilter<"Gift"> | string | null
    published?: BoolFilter<"Gift"> | boolean
    ownerId?: UuidFilter<"Gift"> | string
    claimed?: BoolFilter<"Gift"> | boolean
    claimedById?: UuidNullableFilter<"Gift"> | string | null
    createdById?: UuidNullableFilter<"Gift"> | string | null
  }

  export type GiftUpsertWithWhereUniqueWithoutClaimedByInput = {
    where: GiftWhereUniqueInput
    update: XOR<GiftUpdateWithoutClaimedByInput, GiftUncheckedUpdateWithoutClaimedByInput>
    create: XOR<GiftCreateWithoutClaimedByInput, GiftUncheckedCreateWithoutClaimedByInput>
  }

  export type GiftUpdateWithWhereUniqueWithoutClaimedByInput = {
    where: GiftWhereUniqueInput
    data: XOR<GiftUpdateWithoutClaimedByInput, GiftUncheckedUpdateWithoutClaimedByInput>
  }

  export type GiftUpdateManyWithWhereWithoutClaimedByInput = {
    where: GiftScalarWhereInput
    data: XOR<GiftUpdateManyMutationInput, GiftUncheckedUpdateManyWithoutClaimedByInput>
  }

  export type GiftUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: GiftWhereUniqueInput
    update: XOR<GiftUpdateWithoutCreatedByInput, GiftUncheckedUpdateWithoutCreatedByInput>
    create: XOR<GiftCreateWithoutCreatedByInput, GiftUncheckedCreateWithoutCreatedByInput>
  }

  export type GiftUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: GiftWhereUniqueInput
    data: XOR<GiftUpdateWithoutCreatedByInput, GiftUncheckedUpdateWithoutCreatedByInput>
  }

  export type GiftUpdateManyWithWhereWithoutCreatedByInput = {
    where: GiftScalarWhereInput
    data: XOR<GiftUpdateManyMutationInput, GiftUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type WishlistUpsertWithWhereUniqueWithoutMembersInput = {
    where: WishlistWhereUniqueInput
    update: XOR<WishlistUpdateWithoutMembersInput, WishlistUncheckedUpdateWithoutMembersInput>
    create: XOR<WishlistCreateWithoutMembersInput, WishlistUncheckedCreateWithoutMembersInput>
  }

  export type WishlistUpdateWithWhereUniqueWithoutMembersInput = {
    where: WishlistWhereUniqueInput
    data: XOR<WishlistUpdateWithoutMembersInput, WishlistUncheckedUpdateWithoutMembersInput>
  }

  export type WishlistUpdateManyWithWhereWithoutMembersInput = {
    where: WishlistScalarWhereInput
    data: XOR<WishlistUpdateManyMutationInput, WishlistUncheckedUpdateManyWithoutMembersInput>
  }

  export type WishlistScalarWhereInput = {
    AND?: WishlistScalarWhereInput | WishlistScalarWhereInput[]
    OR?: WishlistScalarWhereInput[]
    NOT?: WishlistScalarWhereInput | WishlistScalarWhereInput[]
    id?: UuidFilter<"Wishlist"> | string
    createdAt?: DateTimeFilter<"Wishlist"> | Date | string
    updatedAt?: DateTimeFilter<"Wishlist"> | Date | string
    name?: StringFilter<"Wishlist"> | string
    password?: StringFilter<"Wishlist"> | string
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: UuidFilter<"Account"> | string
    userId?: UuidFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: UuidFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: UuidFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
  }

  export type SecretSantaEventUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: SecretSantaEventWhereUniqueInput
    update: XOR<SecretSantaEventUpdateWithoutCreatedByInput, SecretSantaEventUncheckedUpdateWithoutCreatedByInput>
    create: XOR<SecretSantaEventCreateWithoutCreatedByInput, SecretSantaEventUncheckedCreateWithoutCreatedByInput>
  }

  export type SecretSantaEventUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: SecretSantaEventWhereUniqueInput
    data: XOR<SecretSantaEventUpdateWithoutCreatedByInput, SecretSantaEventUncheckedUpdateWithoutCreatedByInput>
  }

  export type SecretSantaEventUpdateManyWithWhereWithoutCreatedByInput = {
    where: SecretSantaEventScalarWhereInput
    data: XOR<SecretSantaEventUpdateManyMutationInput, SecretSantaEventUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type SecretSantaEventScalarWhereInput = {
    AND?: SecretSantaEventScalarWhereInput | SecretSantaEventScalarWhereInput[]
    OR?: SecretSantaEventScalarWhereInput[]
    NOT?: SecretSantaEventScalarWhereInput | SecretSantaEventScalarWhereInput[]
    id?: UuidFilter<"SecretSantaEvent"> | string
    name?: StringFilter<"SecretSantaEvent"> | string
    createdAt?: DateTimeFilter<"SecretSantaEvent"> | Date | string
    updatedAt?: DateTimeFilter<"SecretSantaEvent"> | Date | string
    createdById?: UuidFilter<"SecretSantaEvent"> | string
  }

  export type SecretSantaParticipantUpsertWithWhereUniqueWithoutUserInput = {
    where: SecretSantaParticipantWhereUniqueInput
    update: XOR<SecretSantaParticipantUpdateWithoutUserInput, SecretSantaParticipantUncheckedUpdateWithoutUserInput>
    create: XOR<SecretSantaParticipantCreateWithoutUserInput, SecretSantaParticipantUncheckedCreateWithoutUserInput>
  }

  export type SecretSantaParticipantUpdateWithWhereUniqueWithoutUserInput = {
    where: SecretSantaParticipantWhereUniqueInput
    data: XOR<SecretSantaParticipantUpdateWithoutUserInput, SecretSantaParticipantUncheckedUpdateWithoutUserInput>
  }

  export type SecretSantaParticipantUpdateManyWithWhereWithoutUserInput = {
    where: SecretSantaParticipantScalarWhereInput
    data: XOR<SecretSantaParticipantUpdateManyMutationInput, SecretSantaParticipantUncheckedUpdateManyWithoutUserInput>
  }

  export type SecretSantaParticipantScalarWhereInput = {
    AND?: SecretSantaParticipantScalarWhereInput | SecretSantaParticipantScalarWhereInput[]
    OR?: SecretSantaParticipantScalarWhereInput[]
    NOT?: SecretSantaParticipantScalarWhereInput | SecretSantaParticipantScalarWhereInput[]
    id?: UuidFilter<"SecretSantaParticipant"> | string
    eventId?: UuidFilter<"SecretSantaParticipant"> | string
    userId?: UuidFilter<"SecretSantaParticipant"> | string
    assignedToId?: UuidNullableFilter<"SecretSantaParticipant"> | string | null
    assignedById?: UuidNullableFilter<"SecretSantaParticipant"> | string | null
  }

  export type SecretSantaParticipantUpsertWithWhereUniqueWithoutAssignedToInput = {
    where: SecretSantaParticipantWhereUniqueInput
    update: XOR<SecretSantaParticipantUpdateWithoutAssignedToInput, SecretSantaParticipantUncheckedUpdateWithoutAssignedToInput>
    create: XOR<SecretSantaParticipantCreateWithoutAssignedToInput, SecretSantaParticipantUncheckedCreateWithoutAssignedToInput>
  }

  export type SecretSantaParticipantUpdateWithWhereUniqueWithoutAssignedToInput = {
    where: SecretSantaParticipantWhereUniqueInput
    data: XOR<SecretSantaParticipantUpdateWithoutAssignedToInput, SecretSantaParticipantUncheckedUpdateWithoutAssignedToInput>
  }

  export type SecretSantaParticipantUpdateManyWithWhereWithoutAssignedToInput = {
    where: SecretSantaParticipantScalarWhereInput
    data: XOR<SecretSantaParticipantUpdateManyMutationInput, SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToInput>
  }

  export type SecretSantaParticipantUpsertWithWhereUniqueWithoutAssignedByInput = {
    where: SecretSantaParticipantWhereUniqueInput
    update: XOR<SecretSantaParticipantUpdateWithoutAssignedByInput, SecretSantaParticipantUncheckedUpdateWithoutAssignedByInput>
    create: XOR<SecretSantaParticipantCreateWithoutAssignedByInput, SecretSantaParticipantUncheckedCreateWithoutAssignedByInput>
  }

  export type SecretSantaParticipantUpdateWithWhereUniqueWithoutAssignedByInput = {
    where: SecretSantaParticipantWhereUniqueInput
    data: XOR<SecretSantaParticipantUpdateWithoutAssignedByInput, SecretSantaParticipantUncheckedUpdateWithoutAssignedByInput>
  }

  export type SecretSantaParticipantUpdateManyWithWhereWithoutAssignedByInput = {
    where: SecretSantaParticipantScalarWhereInput
    data: XOR<SecretSantaParticipantUpdateManyMutationInput, SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByInput>
  }

  export type UserCreateWithoutGiftsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    claimed?: GiftCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistCreateNestedManyWithoutMembersInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantCreateNestedManyWithoutAssignedByInput
  }

  export type UserUncheckedCreateWithoutGiftsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    claimed?: GiftUncheckedCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftUncheckedCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistUncheckedCreateNestedManyWithoutMembersInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput
  }

  export type UserCreateOrConnectWithoutGiftsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGiftsInput, UserUncheckedCreateWithoutGiftsInput>
  }

  export type UserCreateWithoutClaimedInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftCreateNestedManyWithoutOwnerInput
    createdGifts?: GiftCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistCreateNestedManyWithoutMembersInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantCreateNestedManyWithoutAssignedByInput
  }

  export type UserUncheckedCreateWithoutClaimedInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftUncheckedCreateNestedManyWithoutOwnerInput
    createdGifts?: GiftUncheckedCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistUncheckedCreateNestedManyWithoutMembersInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput
  }

  export type UserCreateOrConnectWithoutClaimedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutClaimedInput, UserUncheckedCreateWithoutClaimedInput>
  }

  export type UserCreateWithoutCreatedGiftsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftCreateNestedManyWithoutOwnerInput
    claimed?: GiftCreateNestedManyWithoutClaimedByInput
    wishlists?: WishlistCreateNestedManyWithoutMembersInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantCreateNestedManyWithoutAssignedByInput
  }

  export type UserUncheckedCreateWithoutCreatedGiftsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftUncheckedCreateNestedManyWithoutOwnerInput
    claimed?: GiftUncheckedCreateNestedManyWithoutClaimedByInput
    wishlists?: WishlistUncheckedCreateNestedManyWithoutMembersInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput
  }

  export type UserCreateOrConnectWithoutCreatedGiftsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedGiftsInput, UserUncheckedCreateWithoutCreatedGiftsInput>
  }

  export type WishlistCreateWithoutGiftsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    password: string
    members?: UserCreateNestedManyWithoutWishlistsInput
  }

  export type WishlistUncheckedCreateWithoutGiftsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    password: string
    members?: UserUncheckedCreateNestedManyWithoutWishlistsInput
  }

  export type WishlistCreateOrConnectWithoutGiftsInput = {
    where: WishlistWhereUniqueInput
    create: XOR<WishlistCreateWithoutGiftsInput, WishlistUncheckedCreateWithoutGiftsInput>
  }

  export type UserUpsertWithoutGiftsInput = {
    update: XOR<UserUpdateWithoutGiftsInput, UserUncheckedUpdateWithoutGiftsInput>
    create: XOR<UserCreateWithoutGiftsInput, UserUncheckedCreateWithoutGiftsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGiftsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGiftsInput, UserUncheckedUpdateWithoutGiftsInput>
  }

  export type UserUpdateWithoutGiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    claimed?: GiftUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUpdateManyWithoutMembersNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateWithoutGiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    claimed?: GiftUncheckedUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUncheckedUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUncheckedUpdateManyWithoutMembersNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUpsertWithoutClaimedInput = {
    update: XOR<UserUpdateWithoutClaimedInput, UserUncheckedUpdateWithoutClaimedInput>
    create: XOR<UserCreateWithoutClaimedInput, UserUncheckedCreateWithoutClaimedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutClaimedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutClaimedInput, UserUncheckedUpdateWithoutClaimedInput>
  }

  export type UserUpdateWithoutClaimedInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUpdateManyWithoutOwnerNestedInput
    createdGifts?: GiftUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUpdateManyWithoutMembersNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateWithoutClaimedInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUncheckedUpdateManyWithoutOwnerNestedInput
    createdGifts?: GiftUncheckedUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUncheckedUpdateManyWithoutMembersNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUpsertWithoutCreatedGiftsInput = {
    update: XOR<UserUpdateWithoutCreatedGiftsInput, UserUncheckedUpdateWithoutCreatedGiftsInput>
    create: XOR<UserCreateWithoutCreatedGiftsInput, UserUncheckedCreateWithoutCreatedGiftsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedGiftsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedGiftsInput, UserUncheckedUpdateWithoutCreatedGiftsInput>
  }

  export type UserUpdateWithoutCreatedGiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUpdateManyWithoutClaimedByNestedInput
    wishlists?: WishlistUpdateManyWithoutMembersNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedGiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUncheckedUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUncheckedUpdateManyWithoutClaimedByNestedInput
    wishlists?: WishlistUncheckedUpdateManyWithoutMembersNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput
  }

  export type WishlistUpsertWithWhereUniqueWithoutGiftsInput = {
    where: WishlistWhereUniqueInput
    update: XOR<WishlistUpdateWithoutGiftsInput, WishlistUncheckedUpdateWithoutGiftsInput>
    create: XOR<WishlistCreateWithoutGiftsInput, WishlistUncheckedCreateWithoutGiftsInput>
  }

  export type WishlistUpdateWithWhereUniqueWithoutGiftsInput = {
    where: WishlistWhereUniqueInput
    data: XOR<WishlistUpdateWithoutGiftsInput, WishlistUncheckedUpdateWithoutGiftsInput>
  }

  export type WishlistUpdateManyWithWhereWithoutGiftsInput = {
    where: WishlistScalarWhereInput
    data: XOR<WishlistUpdateManyMutationInput, WishlistUncheckedUpdateManyWithoutGiftsInput>
  }

  export type UserCreateWithoutWishlistsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftCreateNestedManyWithoutOwnerInput
    claimed?: GiftCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftCreateNestedManyWithoutCreatedByInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantCreateNestedManyWithoutAssignedByInput
  }

  export type UserUncheckedCreateWithoutWishlistsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftUncheckedCreateNestedManyWithoutOwnerInput
    claimed?: GiftUncheckedCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftUncheckedCreateNestedManyWithoutCreatedByInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput
  }

  export type UserCreateOrConnectWithoutWishlistsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWishlistsInput, UserUncheckedCreateWithoutWishlistsInput>
  }

  export type GiftCreateWithoutWishlistsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    claimed?: boolean
    owner: UserCreateNestedOneWithoutGiftsInput
    claimedBy?: UserCreateNestedOneWithoutClaimedInput
    createdBy?: UserCreateNestedOneWithoutCreatedGiftsInput
  }

  export type GiftUncheckedCreateWithoutWishlistsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    ownerId: string
    claimed?: boolean
    claimedById?: string | null
    createdById?: string | null
  }

  export type GiftCreateOrConnectWithoutWishlistsInput = {
    where: GiftWhereUniqueInput
    create: XOR<GiftCreateWithoutWishlistsInput, GiftUncheckedCreateWithoutWishlistsInput>
  }

  export type UserUpsertWithWhereUniqueWithoutWishlistsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutWishlistsInput, UserUncheckedUpdateWithoutWishlistsInput>
    create: XOR<UserCreateWithoutWishlistsInput, UserUncheckedCreateWithoutWishlistsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutWishlistsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutWishlistsInput, UserUncheckedUpdateWithoutWishlistsInput>
  }

  export type UserUpdateManyWithWhereWithoutWishlistsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutWishlistsInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: UuidFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    name?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    pant_size?: StringNullableFilter<"User"> | string | null
    shirt_size?: StringNullableFilter<"User"> | string | null
    shoe_size?: StringNullableFilter<"User"> | string | null
    hasCompletedOnboarding?: BoolFilter<"User"> | boolean
  }

  export type GiftUpsertWithWhereUniqueWithoutWishlistsInput = {
    where: GiftWhereUniqueInput
    update: XOR<GiftUpdateWithoutWishlistsInput, GiftUncheckedUpdateWithoutWishlistsInput>
    create: XOR<GiftCreateWithoutWishlistsInput, GiftUncheckedCreateWithoutWishlistsInput>
  }

  export type GiftUpdateWithWhereUniqueWithoutWishlistsInput = {
    where: GiftWhereUniqueInput
    data: XOR<GiftUpdateWithoutWishlistsInput, GiftUncheckedUpdateWithoutWishlistsInput>
  }

  export type GiftUpdateManyWithWhereWithoutWishlistsInput = {
    where: GiftScalarWhereInput
    data: XOR<GiftUpdateManyMutationInput, GiftUncheckedUpdateManyWithoutWishlistsInput>
  }

  export type UserCreateWithoutCreatedEventsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftCreateNestedManyWithoutOwnerInput
    claimed?: GiftCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistCreateNestedManyWithoutMembersInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    secretSantaParticipations?: SecretSantaParticipantCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantCreateNestedManyWithoutAssignedByInput
  }

  export type UserUncheckedCreateWithoutCreatedEventsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftUncheckedCreateNestedManyWithoutOwnerInput
    claimed?: GiftUncheckedCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftUncheckedCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistUncheckedCreateNestedManyWithoutMembersInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput
  }

  export type UserCreateOrConnectWithoutCreatedEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedEventsInput, UserUncheckedCreateWithoutCreatedEventsInput>
  }

  export type SecretSantaParticipantCreateWithoutEventInput = {
    id?: string
    user: UserCreateNestedOneWithoutSecretSantaParticipationsInput
    assignedTo?: UserCreateNestedOneWithoutSecretSantaAssignedToInput
    assignedBy?: UserCreateNestedOneWithoutSecretSantaAssignedByInput
  }

  export type SecretSantaParticipantUncheckedCreateWithoutEventInput = {
    id?: string
    userId: string
    assignedToId?: string | null
    assignedById?: string | null
  }

  export type SecretSantaParticipantCreateOrConnectWithoutEventInput = {
    where: SecretSantaParticipantWhereUniqueInput
    create: XOR<SecretSantaParticipantCreateWithoutEventInput, SecretSantaParticipantUncheckedCreateWithoutEventInput>
  }

  export type SecretSantaParticipantCreateManyEventInputEnvelope = {
    data: SecretSantaParticipantCreateManyEventInput | SecretSantaParticipantCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCreatedEventsInput = {
    update: XOR<UserUpdateWithoutCreatedEventsInput, UserUncheckedUpdateWithoutCreatedEventsInput>
    create: XOR<UserCreateWithoutCreatedEventsInput, UserUncheckedCreateWithoutCreatedEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedEventsInput, UserUncheckedUpdateWithoutCreatedEventsInput>
  }

  export type UserUpdateWithoutCreatedEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUpdateManyWithoutMembersNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    secretSantaParticipations?: SecretSantaParticipantUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUncheckedUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUncheckedUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUncheckedUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUncheckedUpdateManyWithoutMembersNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput
  }

  export type SecretSantaParticipantUpsertWithWhereUniqueWithoutEventInput = {
    where: SecretSantaParticipantWhereUniqueInput
    update: XOR<SecretSantaParticipantUpdateWithoutEventInput, SecretSantaParticipantUncheckedUpdateWithoutEventInput>
    create: XOR<SecretSantaParticipantCreateWithoutEventInput, SecretSantaParticipantUncheckedCreateWithoutEventInput>
  }

  export type SecretSantaParticipantUpdateWithWhereUniqueWithoutEventInput = {
    where: SecretSantaParticipantWhereUniqueInput
    data: XOR<SecretSantaParticipantUpdateWithoutEventInput, SecretSantaParticipantUncheckedUpdateWithoutEventInput>
  }

  export type SecretSantaParticipantUpdateManyWithWhereWithoutEventInput = {
    where: SecretSantaParticipantScalarWhereInput
    data: XOR<SecretSantaParticipantUpdateManyMutationInput, SecretSantaParticipantUncheckedUpdateManyWithoutEventInput>
  }

  export type SecretSantaEventCreateWithoutParticipantsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutCreatedEventsInput
  }

  export type SecretSantaEventUncheckedCreateWithoutParticipantsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdById: string
  }

  export type SecretSantaEventCreateOrConnectWithoutParticipantsInput = {
    where: SecretSantaEventWhereUniqueInput
    create: XOR<SecretSantaEventCreateWithoutParticipantsInput, SecretSantaEventUncheckedCreateWithoutParticipantsInput>
  }

  export type UserCreateWithoutSecretSantaParticipationsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftCreateNestedManyWithoutOwnerInput
    claimed?: GiftCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistCreateNestedManyWithoutMembersInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventCreateNestedManyWithoutCreatedByInput
    secretSantaAssignedTo?: SecretSantaParticipantCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantCreateNestedManyWithoutAssignedByInput
  }

  export type UserUncheckedCreateWithoutSecretSantaParticipationsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftUncheckedCreateNestedManyWithoutOwnerInput
    claimed?: GiftUncheckedCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftUncheckedCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistUncheckedCreateNestedManyWithoutMembersInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput
  }

  export type UserCreateOrConnectWithoutSecretSantaParticipationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSecretSantaParticipationsInput, UserUncheckedCreateWithoutSecretSantaParticipationsInput>
  }

  export type UserCreateWithoutSecretSantaAssignedToInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftCreateNestedManyWithoutOwnerInput
    claimed?: GiftCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistCreateNestedManyWithoutMembersInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantCreateNestedManyWithoutUserInput
    secretSantaAssignedBy?: SecretSantaParticipantCreateNestedManyWithoutAssignedByInput
  }

  export type UserUncheckedCreateWithoutSecretSantaAssignedToInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftUncheckedCreateNestedManyWithoutOwnerInput
    claimed?: GiftUncheckedCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftUncheckedCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistUncheckedCreateNestedManyWithoutMembersInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedByInput
  }

  export type UserCreateOrConnectWithoutSecretSantaAssignedToInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSecretSantaAssignedToInput, UserUncheckedCreateWithoutSecretSantaAssignedToInput>
  }

  export type UserCreateWithoutSecretSantaAssignedByInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftCreateNestedManyWithoutOwnerInput
    claimed?: GiftCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistCreateNestedManyWithoutMembersInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantCreateNestedManyWithoutAssignedToInput
  }

  export type UserUncheckedCreateWithoutSecretSantaAssignedByInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    address?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    pant_size?: string | null
    shirt_size?: string | null
    shoe_size?: string | null
    hasCompletedOnboarding?: boolean
    gifts?: GiftUncheckedCreateNestedManyWithoutOwnerInput
    claimed?: GiftUncheckedCreateNestedManyWithoutClaimedByInput
    createdGifts?: GiftUncheckedCreateNestedManyWithoutCreatedByInput
    wishlists?: WishlistUncheckedCreateNestedManyWithoutMembersInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    createdEvents?: SecretSantaEventUncheckedCreateNestedManyWithoutCreatedByInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedCreateNestedManyWithoutUserInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedCreateNestedManyWithoutAssignedToInput
  }

  export type UserCreateOrConnectWithoutSecretSantaAssignedByInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSecretSantaAssignedByInput, UserUncheckedCreateWithoutSecretSantaAssignedByInput>
  }

  export type SecretSantaEventUpsertWithoutParticipantsInput = {
    update: XOR<SecretSantaEventUpdateWithoutParticipantsInput, SecretSantaEventUncheckedUpdateWithoutParticipantsInput>
    create: XOR<SecretSantaEventCreateWithoutParticipantsInput, SecretSantaEventUncheckedCreateWithoutParticipantsInput>
    where?: SecretSantaEventWhereInput
  }

  export type SecretSantaEventUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: SecretSantaEventWhereInput
    data: XOR<SecretSantaEventUpdateWithoutParticipantsInput, SecretSantaEventUncheckedUpdateWithoutParticipantsInput>
  }

  export type SecretSantaEventUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutCreatedEventsNestedInput
  }

  export type SecretSantaEventUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpsertWithoutSecretSantaParticipationsInput = {
    update: XOR<UserUpdateWithoutSecretSantaParticipationsInput, UserUncheckedUpdateWithoutSecretSantaParticipationsInput>
    create: XOR<UserCreateWithoutSecretSantaParticipationsInput, UserUncheckedCreateWithoutSecretSantaParticipationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSecretSantaParticipationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSecretSantaParticipationsInput, UserUncheckedUpdateWithoutSecretSantaParticipationsInput>
  }

  export type UserUpdateWithoutSecretSantaParticipationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUpdateManyWithoutMembersNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUpdateManyWithoutCreatedByNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateWithoutSecretSantaParticipationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUncheckedUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUncheckedUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUncheckedUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUncheckedUpdateManyWithoutMembersNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUpsertWithoutSecretSantaAssignedToInput = {
    update: XOR<UserUpdateWithoutSecretSantaAssignedToInput, UserUncheckedUpdateWithoutSecretSantaAssignedToInput>
    create: XOR<UserCreateWithoutSecretSantaAssignedToInput, UserUncheckedCreateWithoutSecretSantaAssignedToInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSecretSantaAssignedToInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSecretSantaAssignedToInput, UserUncheckedUpdateWithoutSecretSantaAssignedToInput>
  }

  export type UserUpdateWithoutSecretSantaAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUpdateManyWithoutMembersNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUpdateManyWithoutUserNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateWithoutSecretSantaAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUncheckedUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUncheckedUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUncheckedUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUncheckedUpdateManyWithoutMembersNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUpsertWithoutSecretSantaAssignedByInput = {
    update: XOR<UserUpdateWithoutSecretSantaAssignedByInput, UserUncheckedUpdateWithoutSecretSantaAssignedByInput>
    create: XOR<UserCreateWithoutSecretSantaAssignedByInput, UserUncheckedCreateWithoutSecretSantaAssignedByInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSecretSantaAssignedByInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSecretSantaAssignedByInput, UserUncheckedUpdateWithoutSecretSantaAssignedByInput>
  }

  export type UserUpdateWithoutSecretSantaAssignedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUpdateManyWithoutMembersNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput
  }

  export type UserUncheckedUpdateWithoutSecretSantaAssignedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUncheckedUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUncheckedUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUncheckedUpdateManyWithoutCreatedByNestedInput
    wishlists?: WishlistUncheckedUpdateManyWithoutMembersNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput
  }

  export type GiftCreateManyOwnerInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    claimed?: boolean
    claimedById?: string | null
    createdById?: string | null
  }

  export type GiftCreateManyClaimedByInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    ownerId: string
    claimed?: boolean
    createdById?: string | null
  }

  export type GiftCreateManyCreatedByInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    image?: string | null
    url?: string | null
    description?: string | null
    published?: boolean
    ownerId: string
    claimed?: boolean
    claimedById?: string | null
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SecretSantaEventCreateManyCreatedByInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SecretSantaParticipantCreateManyUserInput = {
    id?: string
    eventId: string
    assignedToId?: string | null
    assignedById?: string | null
  }

  export type SecretSantaParticipantCreateManyAssignedToInput = {
    id?: string
    eventId: string
    userId: string
    assignedById?: string | null
  }

  export type SecretSantaParticipantCreateManyAssignedByInput = {
    id?: string
    eventId: string
    userId: string
    assignedToId?: string | null
  }

  export type GiftUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedBy?: UserUpdateOneWithoutClaimedNestedInput
    createdBy?: UserUpdateOneWithoutCreatedGiftsNestedInput
    wishlists?: WishlistUpdateManyWithoutGiftsNestedInput
  }

  export type GiftUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    wishlists?: WishlistUncheckedUpdateManyWithoutGiftsNestedInput
  }

  export type GiftUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GiftUpdateWithoutClaimedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    claimed?: BoolFieldUpdateOperationsInput | boolean
    owner?: UserUpdateOneRequiredWithoutGiftsNestedInput
    createdBy?: UserUpdateOneWithoutCreatedGiftsNestedInput
    wishlists?: WishlistUpdateManyWithoutGiftsNestedInput
  }

  export type GiftUncheckedUpdateWithoutClaimedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: StringFieldUpdateOperationsInput | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    wishlists?: WishlistUncheckedUpdateManyWithoutGiftsNestedInput
  }

  export type GiftUncheckedUpdateManyWithoutClaimedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: StringFieldUpdateOperationsInput | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GiftUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    claimed?: BoolFieldUpdateOperationsInput | boolean
    owner?: UserUpdateOneRequiredWithoutGiftsNestedInput
    claimedBy?: UserUpdateOneWithoutClaimedNestedInput
    wishlists?: WishlistUpdateManyWithoutGiftsNestedInput
  }

  export type GiftUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: StringFieldUpdateOperationsInput | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedById?: NullableStringFieldUpdateOperationsInput | string | null
    wishlists?: WishlistUncheckedUpdateManyWithoutGiftsNestedInput
  }

  export type GiftUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: StringFieldUpdateOperationsInput | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WishlistUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    gifts?: GiftUpdateManyWithoutWishlistsNestedInput
  }

  export type WishlistUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    gifts?: GiftUncheckedUpdateManyWithoutWishlistsNestedInput
  }

  export type WishlistUncheckedUpdateManyWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecretSantaEventUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: SecretSantaParticipantUpdateManyWithoutEventNestedInput
  }

  export type SecretSantaEventUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: SecretSantaParticipantUncheckedUpdateManyWithoutEventNestedInput
  }

  export type SecretSantaEventUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecretSantaParticipantUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: SecretSantaEventUpdateOneRequiredWithoutParticipantsNestedInput
    assignedTo?: UserUpdateOneWithoutSecretSantaAssignedToNestedInput
    assignedBy?: UserUpdateOneWithoutSecretSantaAssignedByNestedInput
  }

  export type SecretSantaParticipantUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SecretSantaParticipantUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SecretSantaParticipantUpdateWithoutAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: SecretSantaEventUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneRequiredWithoutSecretSantaParticipationsNestedInput
    assignedBy?: UserUpdateOneWithoutSecretSantaAssignedByNestedInput
  }

  export type SecretSantaParticipantUncheckedUpdateWithoutAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    assignedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    assignedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SecretSantaParticipantUpdateWithoutAssignedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: SecretSantaEventUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneRequiredWithoutSecretSantaParticipationsNestedInput
    assignedTo?: UserUpdateOneWithoutSecretSantaAssignedToNestedInput
  }

  export type SecretSantaParticipantUncheckedUpdateWithoutAssignedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WishlistUpdateWithoutGiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    members?: UserUpdateManyWithoutWishlistsNestedInput
  }

  export type WishlistUncheckedUpdateWithoutGiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    members?: UserUncheckedUpdateManyWithoutWishlistsNestedInput
  }

  export type WishlistUncheckedUpdateManyWithoutGiftsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpdateWithoutWishlistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUpdateManyWithoutCreatedByNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateWithoutWishlistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    gifts?: GiftUncheckedUpdateManyWithoutOwnerNestedInput
    claimed?: GiftUncheckedUpdateManyWithoutClaimedByNestedInput
    createdGifts?: GiftUncheckedUpdateManyWithoutCreatedByNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    createdEvents?: SecretSantaEventUncheckedUpdateManyWithoutCreatedByNestedInput
    secretSantaParticipations?: SecretSantaParticipantUncheckedUpdateManyWithoutUserNestedInput
    secretSantaAssignedTo?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedToNestedInput
    secretSantaAssignedBy?: SecretSantaParticipantUncheckedUpdateManyWithoutAssignedByNestedInput
  }

  export type UserUncheckedUpdateManyWithoutWishlistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    pant_size?: NullableStringFieldUpdateOperationsInput | string | null
    shirt_size?: NullableStringFieldUpdateOperationsInput | string | null
    shoe_size?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GiftUpdateWithoutWishlistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    claimed?: BoolFieldUpdateOperationsInput | boolean
    owner?: UserUpdateOneRequiredWithoutGiftsNestedInput
    claimedBy?: UserUpdateOneWithoutClaimedNestedInput
    createdBy?: UserUpdateOneWithoutCreatedGiftsNestedInput
  }

  export type GiftUncheckedUpdateWithoutWishlistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: StringFieldUpdateOperationsInput | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GiftUncheckedUpdateManyWithoutWishlistsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: StringFieldUpdateOperationsInput | string
    claimed?: BoolFieldUpdateOperationsInput | boolean
    claimedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SecretSantaParticipantCreateManyEventInput = {
    id?: string
    userId: string
    assignedToId?: string | null
    assignedById?: string | null
  }

  export type SecretSantaParticipantUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutSecretSantaParticipationsNestedInput
    assignedTo?: UserUpdateOneWithoutSecretSantaAssignedToNestedInput
    assignedBy?: UserUpdateOneWithoutSecretSantaAssignedByNestedInput
  }

  export type SecretSantaParticipantUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedById?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SecretSantaParticipantUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    assignedToId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedById?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}