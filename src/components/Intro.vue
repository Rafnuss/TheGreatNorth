<template>
  <div>
    <h2 class="fw-bold display-5 mb-1">The Great North</h2>
    <p class="opacity-75">16 May – 4 July 2025 (50 days)</p>
    <div class="mb-4">
      <p>
        Between 16th May and 4th of July 2025, we embarked on a family roadtrip to the
        <i>Great North</i> of Europe in a camping-car! More narrative on each country is available
        for each trip report:
      </p>
      <div class="d-flex flex-wrap gap-3">
        <a
          href="https://ebird.org/tripreport/391401"
          target="_blank"
          class="btn btn-outline-primary"
          >🇩🇪 DE</a
        >
        <a
          href="https://ebird.org/tripreport/377229"
          target="_blank"
          class="btn btn-outline-primary"
          >🇵🇱 PL</a
        >
        <a
          href="https://ebird.org/tripreport/378180"
          target="_blank"
          class="btn btn-outline-primary"
          >🇱🇹 LI</a
        >
        <a
          href="https://ebird.org/tripreport/378388"
          target="_blank"
          class="btn btn-outline-primary"
          >🇱🇻 LV</a
        >
        <a
          href="https://ebird.org/tripreport/380243"
          target="_blank"
          class="btn btn-outline-primary"
          >🇪🇪 EE</a
        >
        <a
          href="https://ebird.org/tripreport/382025"
          target="_blank"
          class="btn btn-outline-primary"
          >🇫🇮 FI</a
        >
        <a
          href="https://ebird.org/tripreport/386664"
          target="_blank"
          class="btn btn-outline-primary"
          >🇳🇴 NO</a
        >
      </div>
    </div>

    <div class="container my-4">
      <div class="row row-cols-2 row-cols-md-5 g-2 text-center">
        <div v-for="s in stat" :key="s.text" class="col h-100">
          <a :href="s.link" target="_blank">
            <div class="text-bg-primary rounded h-100 mx-1 py-1">
              <h5 class="mb-1">{{ s.nb.toLocaleString() }}</h5>
              <p class="small mb-1">{{ s.text }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Section 1 -->
    <h2>
      Lifer Summary
      <button class="btn btn-link" @click="toggle(1)">
        <i :class="open[1] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </button>
    </h2>
    <div class="container mb-4" v-show="open[1]">
      <p>
        At such latitude, the species richness is low, making each lifer even more special! On the
        10 possible lifers, <b>we ticked 7 of them</b>!
      </p>
      <ul class="list-unstyled">
        <li>
          ✅
          <a href="https://ebird.org/checklist/S251698421#arcwar1" target="_blank"
            >Arctic Warbler</a
          >
          – Quite a few encountered in Sør-Varanger. We really enjoyed the rich song of this chubby
          little Phylloscopus!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S245266848#boowar1" target="_blank"
            >Booted Warbler</a
          >
          – Happy to tick this species in its specific habitat, with a singing bird and a touch of
          mist. A magical scene—even if Idunas aren't the flashiest visually!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S251018893#gyhchi" target="_blank">Siberian Tit</a>
          – Tits are always a joy to search for! A bit of playback, and suddenly they're all around.
          We'll need to head to Asia for the rest of the Poeciles.
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S250914288#parcro2" target="_blank"
            >Parrot Crossbill</a
          >
          – Crossbills are tricky. You hear them calling in flight, hope they perch, and then get
          fooled by bill size and angles... Still, a good one to tick!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S250914288#refblu1" target="_blank"
            >Red-flanked Bluetail</a
          >
          – What a stunning bird! Recently colonizing northeast Finland. I typically found 1–3
          singers on damp mountain slopes.
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S250914288#rusbun" target="_blank">Rustic Bunting</a>
          – A gorgeous bunting in breeding plumage—so much nicer than in winter! Lovely song too.
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S251258197#sibjay1" target="_blank">Siberian Jay</a>
          – Searching for these jays reminded us of the U.S., with its many jay species. A great
          bird to watch.
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S253722868#yebloo" target="_blank"
            >White-billed Diver</a
          >
          – Three sightings: a close flying immature, a distant breeding adult on calm water, and
          another immature in wavy water. Not perfect views, but still exciting!
        </li>
        <li>❌ Lanceolated Warbler – None reported this year.</li>
        <li>
          ❌ Greater Spotted Eagle – Possibly in Poland, but we didn't spend enough time searching.
          Hoping to catch one on migration or wintering in France, Spain, or Italy.
        </li>
        <li>
          ❌
          <a href="https://ebird.org/checklist/S255540840" target="_blank">Paddyfield Warbler</a>
          – We gave it a solid try: one evening and a full morning (from early to late)... but not a
          peep.
        </li>
      </ul>
    </div>

    <!-- Section 2 -->
    <h2>
      Palearctic Lifers
      <button class="btn btn-link" @click="toggle(2)">
        <i :class="open[2] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </button>
    </h2>
    <div class="container mb-4" v-show="open[2]">
      <p>On top, we also made a a few Palearctic lifers:</p>
      <ul class="list-unstyled">
        <li>
          ✅
          <a href="https://ebird.org/checklist/S240284378#eurwar2" target="_blank">River Warbler</a>
          – Locustella should only be heard, not seen! It's such a different experience than ringing
          them in Ngulia, yet the same specie!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S240653495#amewig" target="_blank"
            >American Wigeon</a
          >
          – A known vagrant individual. Always fun to catch a Nearctic guest on this side of the
          ocean!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S254192063#cacgoo1" target="_blank"
            >Cackling Goose</a
          >
          – A breeding bird visible only with a scope and very precise directions. Worth the effort!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S253683628#thbmur" target="_blank"
            >Brünnich's Guillemot</a
          >
          – After missing one in Iceland, it was a treat to see them up close on breeding cliffs in
          Vardø.
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S253383652#kineid" target="_blank">King Eider</a> – I
          used to chase lone wintering individuals, so it was great to finally see a proper group—as
          ducks should be!
        </li>
      </ul>
    </div>

    <!-- Section 3 -->
    <h2>
      Photo-lifer Cleanup
      <button class="btn btn-link" @click="toggle(3)">
        <i :class="open[3] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </button>
    </h2>
    <div class="container mb-4" v-show="open[3]">
      <p>
        As the number of lifers wasn't that high, I took the opportunity to clean up my photo-lifer
        list—and ended up with 9 missing species:
      </p>
      <ul class="list-unstyled">
        <li>
          ✅
          <a href="https://ebird.org/checklist/S256521673#eucdov" target="_blank">Collared Dove</a>
          – 680 observations of over 2,000 birds... and not a single photo. Oops!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S250053959" target="_blank">Eurasian Treecreeper</a>
          – 272 sightings, 624 individuals, 8 audio recordings... but no photos until now.
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S241986823#wiltit1" target="_blank">Willow Tit</a>
          – After 127 observations and 7 audio recordings, I finally got the shot!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S246157498" target="_blank"
            >Common Grasshopper Warbler</a
          >
          – This photo proves the rule: Locustellas should be heard, not seen!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S242053330#syrwoo1" target="_blank"
            >Syrian Woodpecker</a
          >
          – Great views this time, and finally a photo-worthy moment.
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S243528656#corcra" target="_blank">Corncrake</a> –
          Tried playback countless times. People showed phone pics of tame birds... not for us.
          After 48 records (108 birds on this trip alone), one blurry flyby finally did it!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S251030515#taibeg1" target="_blank"
            >Taiga Bean Goose</a
          >
          – Glad to photograph it before the lump!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S245790908#blrwar1" target="_blank"
            >Blyth's Reed Warbler</a
          >
          – Credit to Ameline, who ventured out at night with a flashlight and
          phone-camera-through-bino technique!
        </li>
        <li>
          ✅
          <a href="https://ebird.org/checklist/S239541088#rebfly" target="_blank"
            >Red-breasted Flycatcher</a
          >
          – A singing male in breeding forest beats a lonely vagrant in a Falsterbo bush. Sorry, not
          sorry!
        </li>
      </ul>
    </div>

    <h2>
      Figures
      <button class="btn btn-link" @click="toggle(4)">
        <i :class="open[4] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </button>
    </h2>
    <div class="container mb-4" v-show="open[4]">
      <BirdingByTimeChart />
      <TripStatsChart />
      <HistogramChart />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import HistogramChart from "./HistogramChart.vue";
import TripStatsChart from "./TripStatsChart.vue";
import BirdingByTimeChart from "./BirdingByTimeChart.vue";

const stat = [
  { nb: 287, text: "Species" },
  { nb: 683, text: "Checklists" },
  { nb: 142061, text: "Individuals" },
  { nb: 291, text: "Hours" },
  { nb: 416, text: "Km" },
  {
    nb: 838,
    text: "Photos",
    link: "https://media.ebird.org/catalog?userId=USER497615&beginMonth=5&endMonth=7&beginYear=2025&endYear=2025&birdOnly=true&sort=rating_rank_desc&unconfirmed=incl&mediaType=photo",
  },
  {
    nb: 214,
    text: "Audios",
    link: "https://media.ebird.org/catalog?userId=USER497615&beginMonth=5&endMonth=7&beginYear=2025&endYear=2025&birdOnly=true&sort=rating_rank_desc&unconfirmed=incl&mediaType=audio",
  },
  {
    nb: 33,
    text: "Videos",
    link: "https://media.ebird.org/catalog?userId=USER497615&beginMonth=5&endMonth=7&beginYear=2025&endYear=2025&birdOnly=true&sort=rating_rank_desc&unconfirmed=incl&mediaType=video",
  },
  {
    nb: 150,
    text: "Habitat",
    link: "https://media.ebird.org/catalog?userId=USER497615&beginMonth=5&endMonth=7&beginYear=2025&endYear=2025&sort=rating_rank_desc&unconfirmed=incl&mediaType=photo&tag=environmental",
  },
  {
    nb: 145,
    text: "Experiences",
    link: "https://media.ebird.org/catalog?userId=USER497615&beginMonth=5&endMonth=7&beginYear=2025&endYear=2025&sort=rating_rank_desc&unconfirmed=incl&mediaType=photo&tag=experience",
  },
];

const open = ref([false, false, false, false]);
function toggle(i) {
  open.value[i] = !open.value[i];
}
</script>
