<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        Ejemplo con Muchos Registros
      </h1>
      <p class="text-gray-600 mb-6">
        Este ejemplo muestra {{ users.length }} usuarios para demostrar la paginación inteligente
      </p>
      
      <DataTable
        :data="users"
        :columns="columns"
        :actions="true"
        :initial-items-per-page="10"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <!-- Slot personalizado para la columna de estado -->
        <template #cell-status="{ value }">
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              value === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]"
          >
            {{ value }}
          </span>
        </template>

        <!-- Slot personalizado para acciones -->
        <template #actions="{ item }">
          <button
            @click="handleEdit(item)"
            class="text-indigo-600 hover:text-indigo-900 mr-3"
          >
            Editar
          </button>
          <button
            @click="handleDelete(item)"
            class="text-red-600 hover:text-red-900"
          >
            Eliminar
          </button>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '@/components/datatable.vue'

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'department', label: 'Departamento', sortable: true },
  { key: 'role', label: 'Rol', sortable: true },
  { key: 'status', label: 'Estado', sortable: true }
]

// Generar 500 usuarios de ejemplo
const generateUsers = (count) => {
  const names = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Carmen', 'Pedro', 'Laura', 'Miguel', 'Isabel']
  const lastNames = ['Pérez', 'García', 'Rodríguez', 'Martínez', 'Fernández', 'López', 'Sánchez', 'Gómez', 'Torres', 'Ruiz']
  const departments = ['Ventas', 'Marketing', 'IT', 'Recursos Humanos', 'Finanzas', 'Operaciones']
  const roles = ['Administrador', 'Usuario', 'Editor', 'Supervisor', 'Analista']
  const statuses = ['Activo', 'Inactivo']
  
  const users = []
  for (let i = 1; i <= count; i++) {
    const firstName = names[Math.floor(Math.random() * names.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    
    users.push({
      id: i,
      name: name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    })
  }
  
  return users
}

const users = ref(generateUsers(500))

const handleEdit = (item) => {
  console.log('Editar:', item)
  alert(`Editar usuario: ${item.name}`)
}

const handleDelete = (item) => {
  console.log('Eliminar:', item)
  if (confirm(`¿Estás seguro de eliminar a ${item.name}?`)) {
    users.value = users.value.filter(u => u.id !== item.id)
  }
}
</script>
