@component('parts.button_login_oauth_provider', ['provider' => 'microsoft', 'route_reg' => $route_reg, 'delete' => isset($delete) ? $delete : false])
    <span style="font-size: 1.2em; margin: 0 1em 0 0;">
      <i class="fab fa-microsoft"></i>
    </span>
@endcomponent