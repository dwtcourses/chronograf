import Walker from 'src/ifql/ast/walker'
import From from 'test/ifql/ast/from'
import Complex from 'test/ifql/ast/complex'
import {StringLiteral, Expression} from 'test/ifql/ast/variable'

describe('IFQL.AST.Walker', () => {
  describe('Walker#functions', () => {
    describe('simple example', () => {
      describe('a single expression', () => {
        it('returns a flattened ordered list of from and its arguments', () => {
          const walker = new Walker(From)
          expect(walker.stuff).toEqual([
            {
              source: 'from(db: "telegraf")',
              funcs: [
                {
                  name: 'from',
                  source: 'from(db: "telegraf")',
                  arguments: [
                    {
                      key: 'db',
                      value: 'telegraf',
                    },
                  ],
                },
              ],
            },
          ])
        })

        describe('variables', () => {
          describe('a single string literal variable', () => {
            it('returns the expected list', () => {
              const walker = new Walker(StringLiteral)
              expect(walker.stuff).toEqual([
                {
                  type: 'VariableDeclaration',
                  source: 'bux = "im a var"',
                  declarations: [
                    {
                      name: 'bux',
                      type: 'StringLiteral',
                      value: 'im a var',
                    },
                  ],
                },
              ])
            })
          })

          describe('a single expression variable', () => {
            it('returns the expected list', () => {
              const walker = new Walker(Expression)
              expect(walker.stuff).toEqual([
                {
                  type: 'VariableDeclaration',
                  source: 'tele = from(db: "telegraf")',
                  declarations: [
                    {
                      name: 'tele',
                      type: 'CallExpression',
                      source: 'tele = from(db: "telegraf")',
                      funcs: [
                        {
                          name: 'from',
                          source: 'from(db: "telegraf")',
                          arguments: [
                            {
                              key: 'db',
                              value: 'telegraf',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ])
            })
          })
        })
      })
    })

    describe('complex example', () => {
      it('returns a flattened ordered list of all funcs and their arguments', () => {
        const walker = new Walker(Complex)
        expect(walker.stuff).toEqual([
          {
            source:
              'from(db: "telegraf") |> filter(fn: (r) => r["_measurement"] == "cpu") |> range(start: -1m)',
            funcs: [
              {
                name: 'from',
                source: 'from(db: "telegraf")',
                arguments: [{key: 'db', value: 'telegraf'}],
              },
              {
                name: 'filter',
                source: '|> filter(fn: (r) => r["_measurement"] == "cpu")',
                arguments: [
                  {
                    key: 'fn',
                    value: '(r) => r["_measurement"] == "cpu"',
                  },
                ],
              },
              {
                name: 'range',
                source: '|> range(start: -1m)',
                arguments: [{key: 'start', value: '-1m'}],
              },
            ],
          },
        ])
      })
    })
  })
})
