<?php 
log_log(__FILE__.' on line number '.__LINE__);
function getMassageList($max=100, $start=0, $keyword='', $lat='', $lon='', $radius='', $params=array(), $cacheTime=900) {
  global $modelGeneral;
  $return = array();
  $maxRows_rsView = (int) $max;
  $startRow_rsView = (int) $start;
  $pageNum_rsView = floor($startRow_rsView / $maxRows_rsView);
  $return['max'] = $maxRows_rsView;
  $return['page'] = $pageNum_rsView;
  $return['start'] = $startRow_rsView;
  $return['cacheTime'] = $cacheTime;
  $distance = '';
  $distanceWhere = '';
  $orderBy = ' ORDER BY m.created_on DESC';
  if (!empty($lat) && !empty($lon) && !empty($radius)) {
    $distance = ", (ROUND(
    DEGREES(ACOS(SIN(RADIANS(".GetSQLValueString($lat, 'double').")) * SIN(RADIANS(m.lat)) + COS(RADIANS(".GetSQLValueString($lat, 'double').")) * COS(RADIANS(m.lat)) * COS(RADIANS(".GetSQLValueString($lon, 'double')." -(m.lng)))))*60*1.1515,2)) as distance";
    $distanceWhere = " AND (ROUND(
    DEGREES(ACOS(SIN(RADIANS(".GetSQLValueString($lat, 'double').")) * SIN(RADIANS(m.lat)) + COS(RADIANS(".GetSQLValueString($lat, 'double').")) * COS(RADIANS(m.lat)) * COS(RADIANS(".GetSQLValueString($lon, 'double')." -(m.lng)))))*60*1.1515,2)) <= ".GetSQLValueString($radius, 'int');
    $orderBy = ' ORDER BY distance ASC, m.created_on DESC';
  }
  
  $mainSql = "select * $distance";
  $sql = " from massage as m WHERE 1 $distanceWhere AND m.status = 1 AND m.deleted = 0";
  if (!empty($keyword)) {
    $sql .= " AND (m.name like ".GetSQLValueString('%'.$keyword.'%', 'text')." OR m.description like ".GetSQLValueString('%'.$keyword.'%', 'text').")";
  }
  
  if (!empty($params)) {
    $sql .= " AND (";
    $tmp = array();
    foreach ($params as $k => $v) {
      $tmp[] = "m.".$v." = 1";
    }
    $tmpString = implode(' OR ', $tmp);
    $sql .= $tmpString;
    $sql .= ")";
  }
  
  $sql_limit_rsView = sprintf("%s LIMIT %d, %d", $mainSql.$sql.$orderBy, $startRow_rsView, $maxRows_rsView);

  $data = $modelGeneral->fetchAll($sql_limit_rsView, array(), $cacheTime);

  $queryTotalRows = 'select count(*) as cnt '.$sql;
  $rowCountResult = $modelGeneral->fetchRow($queryTotalRows, array(), $cacheTime);
  $sql2 = $queryTotalRows;
  $totalRows_rsView = (int) $rowCountResult['cnt'];
  $totalPages_rsView = ceil($totalRows_rsView/$maxRows_rsView)-1;
  $return['totalRows'] = $totalRows_rsView;
  $return['totalPages'] = $totalPages_rsView;
  $return['data'] = $data;
  $return['sql1'] = $sql_limit_rsView;
  $return['sql2'] = $sql2;
  return $return;
}

function getMassageDetail() {
  
}

$keyword = '';
if (!empty($_GET['kw'])) {
 $keyword = $_GET['kw'];
}
$lat = '';
if (!empty($_GET['q']['lat'])) {
 $lat = $_GET['q']['lat'];
 $_GET['lat'] = $lat;
} else if (!empty($_GET['lat'])) {
 $lat = $_GET['lat'];
}
$lng = '';
if (!empty($_GET['q']['lng'])) {
 $lng = $_GET['q']['lng'];
 $_GET['lng'] = $lng;
} else if (!empty($_GET['lng'])) {
 $lng = $_GET['lng'];
}

if (!empty($_GET['q']['city'])) {
  $_GET['location'] = $_GET['q']['city'];
}

if (empty($_GET['location'])) {
  $lat = '';
  $lng = '';
  if (!empty($_SESSION['location']['nearby'][0]) && $_SERVER['REQUEST_URI'] === '/') {
    $lat = $_SESSION['location']['nearby'][0]['latitude'];
    $lng = $_SESSION['location']['nearby'][0]['longitude'];
    $_GET['lat'] = $lat;
    $_GET['lng'] = $lng;
    $_GET['location'] = $_SESSION['location']['nearby'][0]['name'];
  }
}

$params = array();
if (!empty($_GET['params'])) {
 $params = $_GET['params'];
 $params = array_filter($params);
}

$return = getMassageList(100, $start=0, $keyword, $lat, $lng, 100000, $params);
define('DEFAULT_IMAGE', 'http://bento.cdn.pbs.org/hostedbento-prod/filer_public/_bento_media/img/no-image-available.jpg');
?>
<script>
function submitSearch()
{
  return false; 
}
</script>

  <div class="row">
    <div class="col-md-12">
      <h1>Massage Professionals</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-md-4">
      <h3>Search</h3>
      <form action="location" method="get" name="form1" id="form1">
          <div class="form-group">
              <label for="keyword">Keyword</label>
              <input type="keyword" class="form-control" id="kw" name="kw" placeholder="Enter keyword" value="<?php echo isset($_GET['kw']) ? $_GET['kw'] : ''; ?>">
          </div>
          <div class="form-group">
            <label for="location">Location</label>
            <input type="text" class="form-control addressBox" id="location" name="location" placeholder="Enter Location" value="<?php echo isset($_GET['location']) ? $_GET['location'] : ''; ?>">
          </div>
          <div class="form-group">
              <label for="type">Massage Type</label>
              <select class="form-control" id="params" name="params[]" multiple size="5">
                <option value="">Select</option>
                <?php foreach ($massageTypes as $key => $types) { 
                      ?>
                <option value="<?php echo $key; ?>" <?php if (in_array($key, $params)) { ?>selected<?php } ?>><small><?php echo $types['name']; ?></small></option>
                      <?php
                    } ?>
              </select>
          </div>
          <input type="hidden" class="field" id="lat" name="lat" value="<?php echo isset($_GET['lat']) ? $_GET['lat'] : ''; ?>">
          <input type="hidden" class="field" id="lng" name="lng" value="<?php echo isset($_GET['lng']) ? $_GET['lng'] : ''; ?>">
          <button type="submit" class="btn btn-default">Search</button>
      </form>
    </div>
    <div class="col-md-8">
      <h3>Results</h3>
      <?php if ($return['totalRows'] > 0 && !empty($return['data'])) { ?>
        <?php foreach ($return['data'] as $k => $v) { ?>
        <?php $images = json_decode($v['images']); $mainImage = !empty($images[0]) ? $images[0] : DEFAULT_IMAGE; ?>
          <div class="row">
              <div class="col-md-3">
                  <a href="details/<?php echo $v['id']; ?>">
                      <img class="img-thumbnail img-responsive" src="<?php echo $mainImage; ?>" alt="...">
                  </a>
              </div>
              <div class="col-md-5">
                <h4 class="media-heading"><a href="details/<?php echo $v['id']; ?>"><?php echo $v['name']; ?></a></h4>
                  <p><?php echo $v['description']; ?></p>
                  <p><small><?php echo $v['location']; ?>
                    <?php if (!empty($v['distance'])) { ?>
                  <br><strong>Distance:</strong> <?php echo $v['distance']; ?> mi
                    <?php } ?></small></p>
                  <p><small><b>Massage Types:</b> 
                    <?php foreach ($massageTypes as $key => $types) { 
                      if (empty($v[$key])) continue;
                      echo $types['name'].', ';
                    } ?>
                  </small></p>
              </div>
              <div class="col-md-4">
                  <?php if (!empty($v['min30_charges'])) { ?>
                  <span class="chargeHead">30 Min Charges:</span>  <span class="" style="text-decoration:line-through">$<?php echo $v['min30_charges']; ?></span> <span class="">$<?php echo $v['min30_charges'] - ($v['min30_charges'] / $v['discount_perc']); ?></span><br>
                  <?php } ?>
                  <?php if (!empty($v['min60_charges'])) { ?>
                  <span class="chargeHead">60 Min Charges:</span> <span class="" style="text-decoration:line-through">$<?php echo $v['min60_charges']; ?></span> <span class="">$<?php echo $v['min60_charges'] - ($v['min60_charges'] / $v['discount_perc']); ?></span><br>
                  <?php } ?>
                  <?php if (!empty($v['min90_charges'])) { ?>
                  <span class="chargeHead">90 Min Charges:</span> <span class="" style="text-decoration:line-through">$<?php echo $v['min90_charges']; ?></span> <span class="">$<?php echo $v['min90_charges'] - ($v['min90_charges'] / $v['discount_perc']); ?></span><br>
                  <?php } ?>
                  <?php if (!empty($v['min120_charges'])) { ?>
                  <span class="chargeHead">120 Min Charges:</span> <span class="" style="text-decoration:line-through">$<?php echo $v['min120_charges']; ?></span> <span class="">$<?php echo $v['min120_charges'] - ($v['min120_charges'] / $v['discount_perc']); ?></span><br>
                  <?php } ?>
              </div>
          </div>
        <?php } ?>
      <?php } ?>
      
      
    </div>
  </div>

<script>
// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCWqKxrgU8N1SGtNoD6uD6wFoGeEz0xwbs&libraries=places">

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  administrative_area_level_2: 'long_name',
  country: 'long_name',
  postal_code: 'short_name'
};
var resultPlace = {};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('location')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  console.log(place);
  resultPlace.lat = place.geometry.location.lat();
  resultPlace.lng = place.geometry.location.lng();
  
  document.getElementById('lat').value = resultPlace.lat;
  document.getElementById('lng').value = resultPlace.lng;
  
  //$('#form1').attr('action', 'location/Modesto/37.6656/-120.992');
}
initAutocomplete();
</script>