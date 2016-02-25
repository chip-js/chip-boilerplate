
module.exports =
  created: ->

  attached: ->

  detached: ->

  sayHello: (event) ->
    event.preventDefault()
    alert('Hello ' + (@name || 'you') + '!')
    @input.focus()
