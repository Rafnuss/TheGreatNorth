<template>
  <h2>Species List</h2>
  <!-- Checkboxes -->
  <div class="px-3 py-2">
    <!-- Search bar -->
    <div class="mb-2">
      <input
        type="text"
        class="form-control"
        v-model="searchText"
        placeholder="Search species..."
      />
    </div>
    <!-- Category checkboxes -->
    <div class="form-check form-check-inline" v-for="cat in categories" :key="cat">
      <input
        class="form-check-input"
        type="checkbox"
        :value="cat"
        v-model="selectedCategories"
        :id="`check-${cat}`"
      />
      <label class="form-check-label" :for="`check-${cat}`">{{ cat }}</label>
    </div>
  </div>
  <table
    class="table table-sm table-borderless align-middle bg-transparent text-nowrap table-hover"
    @mouseleave="emit('update-visible-species', [])"
  >
    <thead>
      <tr>
        <th style="width: 80px" @click="setSort('count')" role="button" class="user-select-none">
          Count
          <i
            v-if="sortKey === 'count'"
            class="bi"
            :class="sortAsc ? 'bi-caret-up-fill' : 'bi-caret-down-fill'"
          ></i>
        </th>
        <th @click="setSort('taxonomic_order')" role="button" class="user-select-none">
          Species name
          <i
            v-if="sortKey === 'taxonomic_order'"
            class="bi"
            :class="sortAsc ? 'bi-caret-up-fill' : 'bi-caret-down-fill'"
          ></i>
        </th>
        <th style="width: 80px" @click="setSort('nobs')" role="button" class="user-select-none">
          Obs.
          <i
            v-if="sortKey === 'nobs'"
            class="bi"
            :class="sortAsc ? 'bi-caret-up-fill' : 'bi-caret-down-fill'"
          ></i>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="t in sortedTaxonomy"
        :key="t.taxonomic_order"
        @mouseenter="emit('update-visible-species', t.taxonomic_order)"
      >
        <td>
          <button type="button" class="btn btn-light btn-sm w-100 text-end" disabled>
            {{ t.count.toLocaleString() }}
          </button>
        </td>
        <td>
          <span class="fw-semibold me-1">{{ t.common_name }}</span>
          <a
            v-if="t.media.length > 0"
            :href="`https://media.ebird.org/catalog?userId=USER497615&beginMonth=5&endMonth=7&beginYear=2025&endYear=2025&birdOnly=true&sort=rating_rank_desc&unconfirmed=incl&taxonCode=${t.species_code}`"
            target="_blank"
          >
            <i class="bi bi-card-image"></i>
          </a>
        </td>
        <td><i class="bi bi-card-checklist"></i> {{ t.nobs }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  taxonomy: Array,
});

const emit = defineEmits(["update-visible-species"]);

const categories = ["species", "slash", "spuh", "hybrid"];
const selectedCategories = ref(["species", "hybrid"]); // all selected by default

const searchText = ref("");

const filteredTaxonomy = computed(() =>
  props.taxonomy.filter((t) => {
    const matchesCategory = selectedCategories.value.includes(t.category);
    const search = searchText.value.toLowerCase().trim();
    const matchesText =
      !search ||
      t.common_name?.toLowerCase().includes(search) ||
      t.scientific_name?.toLowerCase().includes(search);
    return matchesCategory && matchesText;
  })
);

const sortKey = ref("taxonomic_order");
const sortAsc = ref(true);

function setSort(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

const sortedTaxonomy = computed(() => {
  return [...filteredTaxonomy.value].sort((a, b) => {
    const aVal = a[sortKey.value];
    const bVal = b[sortKey.value];

    if (typeof aVal === "string") {
      return sortAsc.value ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortAsc.value ? aVal - bVal : bVal - aVal;
  });
});
</script>

<style scoped>
.card {
  border-radius: 12px;
}

.card-header {
  font-size: 1.1em;
  border-bottom: 1px solid #ddd;
}

.list-group-item {
  padding: 0.75rem 1rem;
}
.fixed-width {
  min-width: 6ch; /* 5 digits + potential thousand separator */
  font-family: monospace;
  text-align: right;
  cursor: default;
}
</style>
