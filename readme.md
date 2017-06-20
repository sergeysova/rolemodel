# rolemodel [![Build Status](https://travis-ci.org/LestaD/rolemodel.svg?branch=master)](https://travis-ci.org/LestaD/rolemodel) [![Coverage Status](https://coveralls.io/repos/github/LestaD/rolemodel/badge.svg?branch=master)](https://coveralls.io/github/LestaD/rolemodel?branch=master)

> Easily juggle roles in your project


## Install

```
$ npm install rolemodel
```


## Usage

```js
const rolemodel = require('rolemodel');

rolemodel('unicorns');
//=> 'unicorns & rainbows'
```


## API

### function role(name: string) => (impl: Role[], rules: object) => Role

Return: `Role`

Create role model.

#### name

Type: `string`

Simple name of the role.

Example:

```js
const Example = role`Example`([], {})

const FooBar = role`FooBar`([], {})

const num = 1
const Demo1 = role`Demo${num}`([], {})
```

#### impl

Type: `Role[]` Array of the Roles

Parent roles which rules inherited from.
Rules concats from all parents.

Example:

```js
const First = role`First`([], { foo: true })

const Second = role`Second`([First], { bar: true })
// Second has all rules from First { foo: true, bar: true }
const Third = role`Third`([], { baz: true })

const Total = role`Total`([Second, Third], { daf: true })
// Total has all rules from First, Second, Third { foo: true, bar: true, baz: true, daf: true }
```

#### rules

Type: `object`

Any object of rules with `boolean` as values.
Rules in current role overwrites rules in parent roles.

Example:

```js
const Basic = role`Basic`([], {
  post: {
    create: false,
    update: false,
    delete: false,
    moderationAccept: false,
    moderationDecline: false,
  },
})

const User = role`User`([Basic], {
  post: {
    create: true,
    update: true,
  },
})

const Moderator = role`Moderator`([Basic], {
  post: {
    moderationAccept: true,
    moderationDecline: true,
  },
})

const Admin = role`Admin`([User], {
  post: {
    delete: true,
  },
})
```

### Role

#### .is(name)

Return: `boolean`

Method check name of the role.

##### name

Type: `string`

Expected name of the role

Example:

```js
const Role = role`Role`([], {})

Role.is('Role') // true
Role.is('Foo') // false
```

#### .can(name)

Return: `boolean`

Check if role has `true` right.

##### name

Type: `string`

Name of the target rule.
If rule not found returns `false`.


Example:

```js
const Example = role`Example`([], { foo: true, bar: { baz: true } })

Example.can('foo') // true
Example.can('bar.baz') // true
Example.can('DemoDemoDemo') // false


const Child = role`Child`([Example], { demo: true, bar: { foo: true } })

Child.can('foo') // true
Child.can('bar.baz') // true
Child.can('bar.foo') // true
Child.can('demo') // true
Child.can('FFFFFFF') // false
```

#### .has(name)

Return: `boolean`

Check if role has right with any value.
If rule not found returns `false`.

##### name

Type: `string`

Name of the target rule.

Example:

```js
const Example = role`Example`([], { bar: { baz: true, demo: false } })

Example.has('foo') // false
Example.has('bar.baz') // true
Example.has('bar.demo') // true
Example.has('DemoDemoDemo') // false


const Child = role`Child`([Example], { bar: { foo: true } })

Child.has('foo') // false
Child.has('bar.baz') // true
Child.has('bar.foo') // true
Child.has('demo') // false
Child.has('FFFFFFF') // false
```


## License

MIT © [Sergey Sova](https://LestaD.top)
