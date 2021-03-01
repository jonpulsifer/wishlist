# DO NOT EDIT MANUALLY
# This is an autogenerated file for types exported from the `graphiql-rails` gem.
# Please instead update this file by running `tapioca sync`.

# typed: true

module GraphiQL
end

module GraphiQL::Rails
  class << self
    def config; end
    def config=(_arg0); end
    def railtie_helpers_paths; end
    def railtie_namespace; end
    def railtie_routes_url_helpers(include_path_helpers = T.unsafe(nil)); end
    def table_name_prefix; end
    def use_relative_model_naming?; end
  end
end

class GraphiQL::Rails::Config
  def initialize(query_params: T.unsafe(nil), initial_query: T.unsafe(nil), title: T.unsafe(nil), logo: T.unsafe(nil), csrf: T.unsafe(nil), headers: T.unsafe(nil)); end

  def csrf; end
  def csrf=(_arg0); end
  def headers; end
  def headers=(_arg0); end
  def initial_query; end
  def initial_query=(_arg0); end
  def logo; end
  def logo=(_arg0); end
  def query_params; end
  def query_params=(_arg0); end
  def resolve_headers(view_context); end
  def title; end
  def title=(_arg0); end
end

GraphiQL::Rails::Config::CSRF_TOKEN_HEADER = T.let(T.unsafe(nil), Hash)

GraphiQL::Rails::Config::DEFAULT_HEADERS = T.let(T.unsafe(nil), Hash)

class GraphiQL::Rails::EditorsController < ::ActionController::Base
  def graphql_endpoint_path; end
  def show; end

  private

  def _layout(lookup_context, formats); end

  class << self
    def _helper_methods; end
    def middleware_stack; end
  end
end

module GraphiQL::Rails::EditorsController::HelperMethods
  include(::ActionController::Base::HelperMethods)

  def graphql_endpoint_path(*args, &block); end
end

class GraphiQL::Rails::Engine < ::Rails::Engine
end

GraphiQL::Rails::VERSION = T.let(T.unsafe(nil), String)