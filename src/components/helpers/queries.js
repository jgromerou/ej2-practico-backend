const URLTareas = import.meta.env.VITE_API_TAREAS;

export const obtenerListaTareas = async () => {
  try {
    const respuesta = await fetch(URLTareas);
    const listaTareas = await respuesta.json();
    return listaTareas;
  } catch (error) {
    console.log(error);
  }
};

export const consultaTarea = async (id) => {
  try {
    const respuesta = await fetch(URLTareas + '/' + id);
    const tarea = await respuesta.json();
    return tarea;
  } catch (error) {
    console.log(error);
  }
};

export const consultaAgregarTarea = async (tarea) => {
  try {
    const respuesta = await fetch(URLTareas, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tarea),
    });
    return respuesta;
  } catch (error) {
    console.log(error);
  }
};

export const consultaBorrarTarea = async (id) => {
  try {
    const respuesta = await fetch(`${URLTareas}/${id}`, {
      method: 'DELETE',
    });
    return respuesta;
  } catch (error) {
    console.log(error);
  }
};

export const consultaEditarTarea = async (tarea, id) => {
  try {
    const respuesta = await fetch(URLTareas + '/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tarea),
    });
    return respuesta;
  } catch (error) {
    console.log(error);
  }
};
