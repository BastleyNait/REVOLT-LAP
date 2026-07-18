## Context

El formulario `ProductForm` en `admin/new` usa inputs no controlados (`defaultValue`) con `useActionState` de React 19. Cuando el server action retorna errores de validación, el componente re-renderiza pero los inputs pierden los valores que el usuario escribió porque `defaultValue` solo se aplica en el primer mount del componente. Además, el server action no devuelve los datos que recibió, por lo que no hay forma de restaurarlos.

El componente `ProductForm` se usa tanto en `admin/new` (crear) como en `admin/[id]/edit` (editar). En el caso de editar, `product` tiene valores reales, pero en crear, `product` es `undefined`.

## Goals / Non-Goals

**Goals:**
- Preservar los valores del formulario cuando el server action retorna errores de validación
- Mantener la compatibilidad con el flujo de edición (`admin/[id]/edit`)
- No romper el comportamiento actual de éxito (redirect tras crear/actualizar)

**Non-Goals:**
- Migrar a una librería de formularios externa (React Hook Form, Formik, etc.)
- Cambiar el sistema de validación (Zod)
- Modificar el comportamiento de los server actions en caso de éxito

## Decisions

**1. Controlled inputs con `useFormState` + estado local separado**
   - Los inputs pasan de `defaultValue` a `value` + `onChange`
   - Un `useState` local mantiene los valores del formulario, independiente del state de `useActionState`
   - Cuando el action retorna errores con valores, se sincronizan al estado local
   - Razón: `useActionState` no está diseñado para mantener datos del formulario, solo el resultado del action. Separar las responsabilidades mantiene el código limpio.
   - Alternativa considerada: usar `useRef` para capturar valores pre-submit y restaurarlos. Rechazada porque no integra bien con el re-render cycle de `useActionState`.

**2. `ActionState` extendido con `values` field**
   - Se agrega `values?: Record<string, any>` a `ActionState`
   - Los server actions parsean el FormData y lo incluyen en el return cuando hay error
   - Razón: es el mecanismo más directo de pasar datos del server al cliente dentro del patrón `useActionState`. No requiere cambiar la firma del action ni agregar hooks adicionales.
   - Alternativa considerada: usar search params para pasar los valores. Rechazada porque los valores del formulario pueden ser grandes y los search params tienen límites de longitud.

**3. Los server actions retornan los valores crudos del FormData, no los transformados**
   - Cuando la validación falla, se retornan los valores raw del FormData (no el objeto transformado por `productInputFromFormData`)
   - Razón: si la validación falla, el objeto transformado puede ser incompleto o incorrecto. Los valores raw del FormData representan fielmente lo que el usuario escribió.
   - Trade-off: requiere leer el FormData manualmente en el caso de error para extraer los valores relevantes.

**4. Los campos dinámicos (images, badges, specs) se mantienen como textarea con newlines**
   - No se convierte a inputs dinámicos con array state
   - Razón: mantener el scope mínimo. Los textareas actuales con newlines funcionan y el problema no está en la estructura de estos campos sino en la persistencia general.

## Risks / Trade-offs

[Complejidad adicional en el componente] → El componente pasa de ser simple (uncontrolled) a tener estado local + sync con action state. Mitigado manteniendo el estado local simple con un solo objeto.

[Performance con muchos re-renders] → Cada `onChange` causa un re-render. Mitigado: el formulario tiene ~15 campos, no es un caso de performance crítico.

[Type safety de `values` en ActionState] → Usar `Record<string, any>` pierde tipado. Mitigado: el componente conoce la estructura y accede propiedades específicas con optional chaining.
