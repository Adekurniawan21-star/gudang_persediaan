<ul class="navbar-nav sidebar sidebar-dark accordion" id="accordionSidebar"
    style="background: linear-gradient(180deg, #4e73df 0%, #1cc88a 100%); box-shadow: 2px 0 10px rgba(0,0,0,0.1);">

    <!-- Sidebar - Brand -->
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="{{ route('dashboard') }}"
       style="background-color: #ffffff; border: 1px solid #d1d3e2; border-radius: 12px; padding: 12px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s;">
        <div class="sidebar-brand-icon" style="display: flex; align-items: center;">
            <img src="{{ asset('images/logo-pertamina.png') }}" style="width: 160px;">
        </div>
    </a>

    <!-- Divider -->
    <hr class="sidebar-divider" style="border-color: rgba(255,255,255,0.3);">

    <!-- Dashboard -->
    <li class="nav-item {{ request()->routeIs('dashboard') ? 'active border-left border-white' : '' }}">
        <a class="nav-link text-white fw-bold" href="{{ route('dashboard') }}"
           style="transition: all 0.3s; border-radius: 8px;">
            <i class="fas fa-tachometer-alt"></i>
            <span style="margin-left: 5px;">Dashboard</span>
        </a>
    </li>

    <!-- Barang -->
    <li class="nav-item {{ request()->routeIs('barang.*') ? 'active border-left border-white' : '' }}">
        <a class="nav-link text-white fw-bold" href="{{ route('barang.index') }}"
           style="transition: all 0.3s; border-radius: 8px;">
            <i class="fas fa-fw fa-boxes"></i>
            <span style="margin-left: 5px;">Barang</span>
        </a>
    </li>

    <!-- Barang Masuk -->
    <li class="nav-item {{ request()->routeIs('barang_masuk.*') ? 'active border-left border-white' : '' }}">
        <a class="nav-link text-white fw-bold" href="{{ route('barang_masuk.index') }}"
           style="transition: all 0.3s; border-radius: 8px;">
            <i class="fas fa-fw fa-plus"></i>
            <span style="margin-left: 5px;">Barang Masuk</span>
        </a>
    </li>

    <!-- Barang Keluar -->
    <li class="nav-item {{ request()->routeIs('barang_keluar.*') ? 'active border-left border-white' : '' }}">
        <a class="nav-link text-white fw-bold" href="{{ route('barang_keluar.index') }}"
           style="transition: all 0.3s; border-radius: 8px;">
            <i class="fas fa-fw fa-minus"></i>
            <span style="margin-left: 5px;">Barang Keluar</span>
        </a>
    </li>

    <!-- Peminjaman -->
    <li class="nav-item {{ request()->routeIs('peminjaman.*') ? 'active border-left border-white' : '' }}">
        <a class="nav-link text-white fw-bold" href="{{ route('peminjaman.index') }}"
           style="transition: all 0.3s; border-radius: 8px;">
            <i class="fas fa-fw fa-handshake"></i>
            <span style="margin-left: 5px;">Peminjaman</span>
        </a>
    </li>

</ul>

<!-- Tambahkan CSS custom di style atau file CSS kamu -->
<style>
    .nav-link {
        font-weight: 600 !important;
        letter-spacing: 0.5px;
    }
    .nav-link:hover {
        background-color: rgba(255, 255, 255, 0.15) !important;
        transform: translateX(5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .nav-item.active .nav-link {
        background-color: rgba(255, 255, 255, 0.25) !important;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        transform: translateX(0);
    }
</style>
