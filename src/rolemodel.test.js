import test from 'ava'
import { role } from './rolemodel'


test('types', (t) => {
  t.throws(() => {
    role`Demo`(1, {})
  })
  t.throws(() => {
    role`Demo`('', {})
  })
  t.throws(() => {
    role`Demo`(true, {})
  })
  t.throws(() => {
    role`Demo`([], 1)
  })
  t.throws(() => {
    role`Demo`({}, {})
  })
  t.throws(() => {
    role`Demo`([], [])
  })
  t.throws(() => {
    role`Demo`([], '')
  })
  t.throws(() => {
    role`Demo`([], false)
  })

  t.notThrows(() => {
    role`Demo`([], {})
  })
})

const demo = () => role`Demo`([], { foo: { bar: true }, baz: true, fals: false })

test('.is()', (t) => {
  const d = demo()
  t.true(d.is('Demo'), 'Expected be a `Demo`')
  t.false(d.is('Zebra'), 'Not a `Zebra`')
})

test('.can()', (t) => {
  const mod = demo()
  t.true(mod.can('foo.bar'))
  t.true(mod.can('baz'))
  t.false(mod.can('fals'))
})

test('.has()', (t) => {
  const mod = demo()
  const ext = role`Ext`([mod], { foo: { baz: true }, bar: true })

  t.true(mod.has('foo.bar'))
  t.true(mod.has('baz'))
  t.true(mod.has('fals'))
  t.false(mod.has('foo.baz'))
  t.false(mod.has('bar'))
  t.false(mod.has('random'))

  t.true(ext.has('foo.bar'))
  t.true(ext.has('baz'))
  t.true(ext.has('fals'))
  t.true(ext.has('foo.baz'))
  t.true(ext.has('bar'))
  t.false(ext.has('random'))
})

const inher = () => {
  const root = demo()
  const mod = role`Second`([root], { foo: { baz: true }, baz: false, gas: true })
  return mod
}

test('inherit 1 level', (t) => {
  const mod = inher()
  t.true(mod.is('Second'), 'Second name expected `Second`')
  t.false(mod.is('Demo'), 'Second can\'t be `Demo`')

  t.true(mod.can('foo.bar'))
  t.true(mod.can('foo.baz'))
  t.false(mod.can('baz'))
  t.false(mod.can('fals'))
  t.true(mod.can('gas'))
})

test('inherit multi levels', (t) => {
  const Viewer = role`First`([], {
    add: false,
    view: false,
    edit: false,
    remove: false,
    comment: { view: false, add: false, remove: false },
  })

  const User = role`Second`([Viewer], {
    view: true,
    comment: { view: true, add: true },
  })

  const Moderator = role`Moderator`([User], {
    remove: true,
    comment: { remove: true },
  })

  const ActivatedUser = role`ActivatedUser`([User], {
    add: true,
    view: true,
    edit: true,
  })

  const Admin = role`Admin`([ActivatedUser, Moderator], {
    remove: true,
    comment: { remove: true },
  })

  t.true(User.can('view'))
  t.false(User.can('remove'))
  t.false(User.can('comment.remove'))

  t.true(Moderator.can('remove'))
  t.true(Moderator.can('comment.remove'))
  t.false(Moderator.can('edit'))

  t.true(ActivatedUser.can('add'))
  t.true(ActivatedUser.can('edit'))
  t.true(ActivatedUser.can('comment.add'))
  t.true(ActivatedUser.can('comment.add'))
  t.false(ActivatedUser.can('comment.remove'))

  t.true(Admin.can('remove'))
  t.true(Admin.can('view'))
  t.true(Admin.can('comment.view'))
})
