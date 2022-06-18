import type { KnownKeysOf } from '@appr/core';

interface AggregateRoot<Identifier> {
  get id(): Identifier;
}

interface Entity<Identifier> {
  get id(): Identifier;
}

abstract class ValueObject {
    
}
