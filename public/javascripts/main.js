function ie_event(e)
{
    if (e === undefined)
        { return window.event; };
    return e;
}

var Canva = {};
 
// Инициализация объекта
Canva.init = function(id, width, height)
{
  var canv = document.getElementById(id);
  canv.width = width;
  canv.height = height;
 
  this.canvasId = id;
  this.ctx = canv.getContext("2d");
  this.selectedColor = '#000000';
  this.selectedFillColor = '#FFFFFF';
  this.selectedWidth = 1;
  this.tool = Pencil; // Выбранный инструмент
  this.drawing = false; // true - если зажата кнопка мыши

  Canva.socket = io.connect('http://localhost:5000')
  console.log(Canva.socket);
  Canva.socket.on('draw', function(data) {
    console.log("inside Canva.draw");
    return Canva.draw(data.x, data.y, data.type);
  });

  Canva.draw = function(x, y, type, event){
    if(type == 'onmousedown'){
//      var evnt = ie_event(event);
      Canva.tool.start({clientX:x, clientY:y});

    } else if( type == 'onmouseup'){
        if (Canva.drawing)
        {
//            var evnt = ie_event(event);
            Canva.tool.finish({clientX:x, clientY:y});
        }
    } else if( type == 'onmousemove'){
        if (Canva.drawing)
        {
//            var evnt = ie_event(event);
            Canva.tool.move({clientX:x, clientY:y});
        }
    }  
  }

    // Кнопка мыши зажата, рисуем
    canv.onmousedown = function(e)
    {
        Canva.draw(e.clientX, e.clientY, "onmousedown");
        Canva.socket.emit('drawClick', {x: e.clientX, y: e.clientY, type: "onmousedown"});
    };
 
    // Кнопка мыши отпущена, рисование прекращаем
    canv.onmouseup = function(e)
    {
      Canva.draw(e.clientX, e.clientY, "onmouseup");
      Canva.socket.emit('drawClick', {x: e.clientX, y: e.clientY, type: "onmouseup"});
    };
 
    // процесс рисования
    canv.onmousemove = function(e)
    {
      Canva.draw(e.clientX, e.clientY, "onmousemove");
      Canva.socket.emit('drawClick', {x: e.clientX, y: e.clientY, type: "onmousemove"});
     };
};
 
Canva.setTool = function(t) // Задать инструмент
{
    Canva.tool = t;
};
 
Canva.setWidth = function(width) // Задать толщину линий
{
    Canvas.selectedWidth = width;
};
 
Canva.setColor = function(color) // Задать текущий цвет
{
    Canva.selectedColor = color;
};
 
Canva.clear = function() // Очистить рисовалку
{
    var canv = document.getElementById(Canva.canvasId);
    Canva.ctx.clearRect(0, 0, canvas.width, canvas.height);
};
