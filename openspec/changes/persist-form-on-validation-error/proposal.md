## Why

Cuando el usuario envía el formulario de `admin/new` y hay errores de validación, todos los campos se limpian obligando a reescribir todo desde cero. Esto es frustrante y aumenta la fricción en el flujo de creación de productos.

## What Changes

- El formulario `ProductForm` preservará los valores ingresados por el usuario cuando el server action retorne errores de validación
- La interfaz `ActionState` incluirá un campo `values` que devuelve los datos enviados para restaurar el formulario
- Los inputs cambiarán de `defaultValue` (uncontrolled) a `value` + `onChange` (controlled) para poder restaurar valores tras un error
- Los server actions `createProductAction` y `updateProductAction` devolverán los valores del formulario en caso de error de validación

## Capabilities

### New Capabilities
- `form-persistence`: El formulario preserva los datos ingresados por el usuario cuando ocurre un error de validación o de servidor, permitiendo corregir sin perder el trabajo realizado

### Modified Capabilities

## Impact

- `src/components/admin/ProductForm.tsx`: Conversión a controlled inputs con estado local
- `src/app/admin/actions.ts`: `ActionState` extendido con `values`, server actions retornan form data en errores
- `src/lib/types/product.ts`: Posible impacto si se necesitan tipos para los valores del formulario
